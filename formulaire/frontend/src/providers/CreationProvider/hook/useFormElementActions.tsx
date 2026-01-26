import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FORMULAIRE } from "~/core/constants";
import { IFormElement } from "~/core/models/formElement/types";
import { getExistingChoices, isQuestion, isSection } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import {
  createNewQuestion,
  createNewQuestionChoice,
  isTypeChildrenQuestion,
  isTypeChoicesQuestion,
} from "~/core/models/question/utils";
import { ISection } from "~/core/models/section/types";
import { updateNextTargetElements } from "~/hook/dnd-hooks/useCreationDnd/utils";
import { useUpdateFormElementsMutation } from "~/services/api/services/formulaireApi/formElementApi";
import {
  useCreateQuestionsMutation,
  useCreateSingleQuestionMutation,
  useDeleteSingleQuestionMutation,
  useUpdateQuestionsMutation,
} from "~/services/api/services/formulaireApi/questionApi";
import {
  useCreateMultipleChoiceQuestionsMutation,
  useUpdateMultipleChoiceQuestionsMutation,
} from "~/services/api/services/formulaireApi/questionChoiceApi";
import {
  useCreateSectionMutation,
  useDeleteSingleSectionMutation,
  useUpdateSectionsMutation,
} from "~/services/api/services/formulaireApi/sectionApi";
import { PositionActionType } from "../enum";
import { fixListPositions, getElementById, isInFormElementsList } from "../utils";

export const useFormElementActions = (
  formElementsList: IFormElement[],
  formId: string,
  currentEditingElement: IFormElement | null,
  setFormElementsList: (list: IFormElement[]) => void,
) => {
  const { t } = useTranslation(FORMULAIRE);

  const [createSingleQuestion] = useCreateSingleQuestionMutation();
  const [createQuestions] = useCreateQuestionsMutation();
  const [updateQuestions] = useUpdateQuestionsMutation();
  const [updateSections] = useUpdateSectionsMutation();
  const [createSections] = useCreateSectionMutation();
  const [updateFormElements] = useUpdateFormElementsMutation();
  const [updateMultipleChoiceQuestions] = useUpdateMultipleChoiceQuestionsMutation();
  const [createMultipleChoiceQuestions] = useCreateMultipleChoiceQuestionsMutation();
  const [deleteSingleQuestion] = useDeleteSingleQuestionMutation();
  const [deleteSingleSection] = useDeleteSingleSectionMutation();

  const updateFormElementsList = async (newFormElementsList: IFormElement[], updateChoices?: boolean) => {
    const questions = newFormElementsList.filter(isQuestion);
    const sections = newFormElementsList.filter(isSection);
    const allExistingChoices = getExistingChoices(newFormElementsList);
    if (!newFormElementsList.length) {
      return;
    }

    if (questions.length && !sections.length) {
      await updateQuestions(questions);
      if (allExistingChoices.length && updateChoices) {
        await updateMultipleChoiceQuestions({ questionChoices: allExistingChoices, formId });
      }
      return;
    }
    if (sections.length && !questions.length) {
      await updateSections(sections);
      if (allExistingChoices.length && updateChoices) {
        await updateMultipleChoiceQuestions({ questionChoices: allExistingChoices, formId });
      }
      return;
    }

    await updateFormElements(newFormElementsList);
    if (allExistingChoices.length && updateChoices) {
      await updateMultipleChoiceQuestions({ questionChoices: allExistingChoices, formId });
    }
    return;
  };

  const deleteFormElement = async (toRemove: IFormElement) => {
    if (!toRemove.id) return;

    // 1. Handle nested question deletion inside a section
    if (isQuestion(toRemove)) {
      await handleNestedQuestionDeletion(toRemove);
    }

    // 2. Handle removal from top-level list and references
    await handleTopLevelDeletion(toRemove);
  };

  const handleNestedQuestionDeletion = async (question: IQuestion) => {
    if (!question.sectionId || !question.sectionPosition || !question.id) return;
    const parent = getElementById(question.sectionId, formElementsList, isSection) as ISection | undefined;
    if (!parent) return;

    // Remove question and fix positions within the section
    const updatedQuestions = fixListPositions(
      parent.questions.filter((q) => q.id !== question.id),
      question.sectionPosition,
      PositionActionType.DELETION,
    );

    await deleteSingleQuestion(question.id);
    await updateFormElementsList(updatedQuestions, true);
  };

  const handleTopLevelDeletion = async (toRemove: IFormElement) => {
    if (!toRemove.position || !toRemove.id) return;

    // Remove element and fix positions
    const filteredList = formElementsList.filter(
      (el) => el.id !== toRemove.id || el.formElementType !== toRemove.formElementType,
    );
    const reindexedList = fixListPositions(filteredList, toRemove.position, PositionActionType.DELETION);

    // Optimistic UI update
    setFormElementsList(reindexedList);

    // Clear any next-references pointing to the removed element
    const cleanedList = reindexedList.map(clearNextReferences(toRemove));

    // Persist deletion
    if (isQuestion(toRemove)) {
      await deleteSingleQuestion(toRemove.id);
    } else if (isSection(toRemove)) {
      await deleteSingleSection(toRemove.id);
    }

    // Push updated list to backend
    await updateFormElementsList(updateNextTargetElements(cleanedList), true);
  };

  const clearNextReferences = (removedElement: IFormElement): ((el: IFormElement) => IFormElement) => {
    // If the removed element is a question, clear any choice-level next refs
    if (isQuestion(removedElement)) {
      return (el) => {
        if (!isQuestion(el)) return el;
        // For each choice, null out nextFormElementId/type if they pointed to the removed question
        const updatedChoices = el.choices?.map((choice) =>
          choice.nextFormElementId === removedElement.id &&
          choice.nextFormElementType === removedElement.formElementType
            ? {
                ...choice,
                nextFormElementId: null,
                nextFormElementType: null,
              }
            : choice,
        );
        return updatedChoices ? { ...el, choices: updatedChoices } : el;
      };
    }

    // Otherwise, it was a section: clear any section-level next refs
    return (el) => {
      if (!isSection(el)) return el;
      const shouldClearNext =
        el.nextFormElementId === removedElement.id && el.nextFormElementType === removedElement.formElementType;
      if (!shouldClearNext) return el;
      // If it pointed to the removed section, null out those fields
      return { ...el, nextFormElementId: null, nextFormElementType: null };
    };
  };

  const duplicateQuestion = async (questionToDuplicate: IQuestion) => {
    try {
      const newPosition = questionToDuplicate.position ? questionToDuplicate.position + 1 : null;
      const newSectionPosition = questionToDuplicate.sectionPosition ? questionToDuplicate.sectionPosition + 1 : null;

      const duplicatedQuestion: IQuestion = {
        ...questionToDuplicate,
        id: null,
        position: newPosition ? newPosition : null,
        sectionPosition: newSectionPosition ? newSectionPosition : null,
      };

      if (questionToDuplicate.sectionId) {
        const parentSection = getElementById(questionToDuplicate.sectionId, formElementsList, isSection) as
          | ISection
          | undefined;

        if (!parentSection) {
          // No parent section nothing to do
          return;
        }
      }

      const formElementUpdatedList: IFormElement[] = questionToDuplicate.sectionId
        ? fixListPositions(
            [...(getElementById(questionToDuplicate.sectionId, formElementsList, isSection) as ISection).questions],
            newSectionPosition ? newSectionPosition : 0,
            PositionActionType.CREATION,
          )
        : fixListPositions(formElementsList, newPosition ? newPosition : 0, PositionActionType.CREATION);

      await updateFormElementsList(formElementUpdatedList, true);

      const newQuestion: IQuestion = await createSingleQuestion(duplicatedQuestion).unwrap();
      const newChoices: IQuestionChoice[] =
        isTypeChoicesQuestion(questionToDuplicate.questionType) && questionToDuplicate.choices
          ? questionToDuplicate.choices
              .filter((choice) => {
                // filter out any choice that has no value
                if (!choice.questionId) choice.questionId = questionToDuplicate.id;
                return !!choice.value;
              })
              .map((choice) =>
                createNewQuestionChoice(newQuestion.id, choice.position, choice.image, choice.value, choice.isCustom),
              )
          : [];

      const newChildrens: IQuestion[] =
        isTypeChildrenQuestion(questionToDuplicate.questionType) && questionToDuplicate.children
          ? questionToDuplicate.children
              .filter((child) => !!child.title) // filter out any child that has no title
              .map((child) => {
                // for each remaining child, create a fresh IQuestion
                const duplicatedChild: IQuestion = createNewQuestion(
                  questionToDuplicate.formId,
                  child.questionType,
                  newQuestion.id,
                  child.matrixPosition,
                  child.title,
                );
                return duplicatedChild;
              })
          : [];
      await saveQuestion(questionToDuplicate);
      if (newChoices.length) {
        await createMultipleChoiceQuestions({
          questionChoices: newChoices,
          formId: formId,
        }).unwrap();
      }
      if (newChildrens.length) {
        await createQuestions(newChildrens).unwrap();
      }
      toast.success(t("formulaire.success.question.duplicate"));
    } catch (error) {
      console.error("Error duplicating question:", error);
    }
  };

  const duplicateSection = async (sectionToDuplicate: ISection) => {
    try {
      if (currentEditingElement && isQuestion(currentEditingElement)) {
        await saveQuestion(currentEditingElement);
      }

      const newPosition = sectionToDuplicate.position ? sectionToDuplicate.position + 1 : null;
      const duplicatedSection: ISection = {
        ...sectionToDuplicate,
        id: null,
        position: newPosition ? newPosition : null,
      };
      const formElementUpdatedList: IFormElement[] = fixListPositions(
        formElementsList,
        newPosition ? newPosition : 0,
        PositionActionType.CREATION,
      );
      await updateFormElementsList(formElementUpdatedList, true);
      const newSection: ISection = await createSections(duplicatedSection).unwrap();
      await Promise.all(
        sectionToDuplicate.questions.map(async (question) => {
          await saveQuestion({
            ...question,
            sectionId: newSection.id,
            isNew: true,
          });
        }),
      );
    } catch (error) {
      console.error("Error duplicating section:", error);
    }
  };

  const saveQuestion = useCallback(
    async (question: IQuestion, updatedFormElementsList?: IFormElement[]) => {
      if (!isInFormElementsList(question, updatedFormElementsList ? updatedFormElementsList : formElementsList)) return;

      //Save Question
      let questionSaved = question;
      if (question.isNew) {
        questionSaved = await createSingleQuestion(question).unwrap();
      } else {
        await updateQuestions([question]).unwrap();
      }

      //Save Choices
      if (
        isTypeChoicesQuestion(question.questionType) &&
        question.choices &&
        question.formId &&
        question.choices.length
      ) {
        const { choicesToUpdateList, choicesToCreateList } = question.choices.reduce(
          (acc, choice) => {
            if (!choice.id) {
              acc.choicesToCreateList = [...acc.choicesToCreateList, choice];
              return acc;
            }
            acc.choicesToUpdateList = [...acc.choicesToUpdateList, choice];
            return acc;
          },
          {
            choicesToUpdateList: [] as IQuestionChoice[],
            choicesToCreateList: [] as IQuestionChoice[],
          },
        );

        if (choicesToUpdateList.length) {
          await updateMultipleChoiceQuestions({
            questionChoices: preventEmptyChoiceValues(
              choicesToUpdateList,
              question.questionType === QuestionTypes.MATRIX,
            ),
            formId: String(question.formId),
          }).unwrap();
        }

        if (choicesToCreateList.length) {
          await createMultipleChoiceQuestions({
            questionChoices: preventEmptyChoiceValues(
              choicesToCreateList,
              question.questionType === QuestionTypes.MATRIX,
            ).map((choice) => {
              return { ...choice, questionId: questionSaved.id };
            }),
            formId: String(question.formId),
          }).unwrap();
        }
      }

      //Save Childrens
      if (
        isTypeChildrenQuestion(question.questionType) &&
        question.children &&
        question.formId &&
        question.children.length
      ) {
        const { childrensToUpdateList, childrensToCreateList } = question.children.reduce(
          (acc, child) => {
            if (!child.id) {
              acc.childrensToCreateList = [...acc.childrensToCreateList, child];
              return acc;
            }
            acc.childrensToUpdateList = [...acc.childrensToUpdateList, child];
            return acc;
          },
          {
            childrensToUpdateList: [] as IQuestion[],
            childrensToCreateList: [] as IQuestion[],
          },
        );

        if (childrensToUpdateList.length) {
          await updateQuestions(
            childrensToUpdateList.map((child) => {
              return { ...child, matrixId: questionSaved.id };
            }),
          ).unwrap();
        }

        if (childrensToCreateList.length) {
          await createQuestions(
            childrensToCreateList.map((child) => {
              return { ...child, matrixId: questionSaved.id };
            }),
          ).unwrap();
        }
      }
    },
    [isInFormElementsList, formElementsList],
  );

  const saveSection = useCallback(
    async (section: ISection, updatedFormElementsList?: IFormElement[]) => {
      if (!isInFormElementsList(section, updatedFormElementsList ? updatedFormElementsList : formElementsList)) return;

      // Save Section
      if (section.isNew) {
        await createSections(section).unwrap();
      } else {
        await updateSections([section]).unwrap();
      }
    },
    [isInFormElementsList, formElementsList],
  );

  const preventEmptyChoiceValues = (choices: IQuestionChoice[], isMatrix: boolean = false) => {
    return choices.map((choice) => {
      if (!choice.value.trim()) {
        const choiceValueI18nKey = isMatrix ? "formulaire.matrix.column.label.default" : "formulaire.option";
        return { ...choice, value: t(choiceValueI18nKey, { 0: choice.position }) };
      }
      return choice;
    });
  };

  return {
    deleteFormElement,
    duplicateQuestion,
    duplicateSection,
    saveQuestion,
    saveSection,
    updateFormElementsList,
    preventEmptyChoiceValues,
  };
};
