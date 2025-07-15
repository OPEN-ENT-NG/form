import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import {
  createNewQuestion,
  createNewQuestionChoice,
  isFormElementQuestion,
  isTypeChildrenQuestion,
  isTypeChoicesQuestion,
} from "~/core/models/question/utils";
import { ISection } from "~/core/models/section/types";
import { isFormElementSection } from "~/core/models/section/utils";
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
import { fixListPositions, getElementById, isInFormElementsList } from "../utils";
import { PositionActionType } from "../enum";
import { toast } from "react-toastify";
import { useCallback } from "react";

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

  const updateFormElementsList = async (newFormElementsList: IFormElement[]) => {
    const questions = newFormElementsList.filter(isFormElementQuestion) as IQuestion[];
    const sections = newFormElementsList.filter(isFormElementSection) as ISection[];
    if (!newFormElementsList.length) {
      return;
    }

    if (questions.length && !sections.length) {
      await updateQuestions(questions);
      return;
    }
    if (sections.length && !questions.length) {
      await updateSections(sections);
      return;
    }

    await updateFormElements(newFormElementsList);
    return;
  };

  const deleteFormElement = async (toRemove: IFormElement) => {
    if (!toRemove.id) return;

    // 1. Handle nested question deletion inside a section
    if (isFormElementQuestion(toRemove)) {
      await handleNestedQuestionDeletion(toRemove as IQuestion);
    }

    // 2. Handle removal from top-level list and references
    await handleTopLevelDeletion(toRemove);
  };

  const handleNestedQuestionDeletion = async (question: IQuestion) => {
    if (!question.sectionId || !question.sectionPosition || !question.id) return;

    const parent = formElementsList.find(
      (el): el is ISection => isFormElementSection(el) && el.id === question.sectionId,
    );
    if (!parent) return;

    // Remove question and fix positions within the section
    const updatedQuestions = fixListPositions(
      parent.questions.filter((q) => q.id !== question.id),
      question.sectionPosition,
      PositionActionType.DELETION,
    );

    await deleteSingleQuestion(question.id);
    await updateFormElementsList(updatedQuestions);
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
    if (isFormElementQuestion(toRemove)) {
      await deleteSingleQuestion(toRemove.id);
    } else if (isFormElementSection(toRemove)) {
      await deleteSingleSection(toRemove.id);
    }

    // Push updated list to backend
    await updateFormElementsList(cleanedList);
  };

  const clearNextReferences = (removedElement: IFormElement): ((el: IFormElement) => IFormElement) => {
    // If the removed element is a question, clear any choice-level next refs
    if (isFormElementQuestion(removedElement)) {
      return (el) => {
        if (!isFormElementQuestion(el)) return el;
        const question = el as IQuestion;
        // For each choice, null out nextFormElementId/type if they pointed to the removed question
        const updatedChoices = question.choices?.map((choice) =>
          choice.nextFormElementId === removedElement.id &&
          choice.nextFormElementType === removedElement.formElementType
            ? {
                ...choice,
                nextFormElementId: null,
                nextFormElementType: null,
              }
            : choice,
        );
        return updatedChoices ? { ...question, choices: updatedChoices } : question;
      };
    }

    // Otherwise, it was a section: clear any section-level next refs
    return (el) => {
      if (!isFormElementSection(el)) return el;
      const section = el as ISection;
      const shouldClearNext =
        section.nextFormElementId === removedElement.id &&
        section.nextFormElementType === removedElement.formElementType;
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
        const parentSection = getElementById(questionToDuplicate.sectionId, formElementsList) as ISection | undefined;

        if (!parentSection) {
          // No parent section nothing to do
          return;
        }
      }

      const formElementUpdatedList: IFormElement[] = questionToDuplicate.sectionId
        ? fixListPositions(
            [...(getElementById(questionToDuplicate.sectionId, formElementsList) as ISection).questions],
            newSectionPosition ? newSectionPosition : 0,
            PositionActionType.CREATION,
          )
        : fixListPositions(formElementsList, newPosition ? newPosition : 0, PositionActionType.CREATION);

      await updateFormElementsList(formElementUpdatedList);

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
              .filter((child) => {
                // filter out any child that has no title
                child.formId = questionToDuplicate.formId;
                child.matrixId = questionToDuplicate.matrixId;
                return !!child.title;
              })
              .map((child) => {
                // for each remaining child, create a fresh IQuestion
                const duplicatedChild: IQuestion = createNewQuestion(
                  questionToDuplicate.formId,
                  child.questionType,
                  newQuestion.id,
                  child.matrixPosition,
                );
                duplicatedChild.title = child.title;
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
      if (currentEditingElement && isFormElementQuestion(currentEditingElement)) {
        await saveQuestion(currentEditingElement as IQuestion);
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
      await updateFormElementsList(formElementUpdatedList);
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
    async (question: IQuestion) => {
      if (!isInFormElementsList(question, formElementsList)) return;

      //Save Question
      if (question.isNew) {
        await createSingleQuestion(question).unwrap();
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
            questionChoices: choicesToUpdateList,
            formId: String(question.formId),
          }).unwrap();
        }

        if (choicesToCreateList.length) {
          await createMultipleChoiceQuestions({
            questionChoices: choicesToCreateList,
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
          await updateQuestions(childrensToUpdateList).unwrap();
        }

        if (childrensToCreateList.length) {
          await createQuestions(childrensToCreateList).unwrap();
        }
      }
    },
    [isInFormElementsList, formElementsList],
  );

  const saveSection = useCallback(
    async (section: ISection) => {
      if (!isInFormElementsList(section, formElementsList)) return;
      // Save Section
      if (section.isNew) {
        await createSections(section).unwrap();
      } else {
        await updateSections([section]).unwrap();
      }
    },
    [isInFormElementsList, formElementsList],
  );

  return {
    deleteFormElement,
    duplicateQuestion,
    duplicateSection,
    saveQuestion,
    saveSection,
    updateFormElementsList,
  };
};
