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
  useUpdateQuestionsMutation,
} from "~/services/api/services/formulaireApi/questionApi";
import {
  useCreateMultipleChoiceQuestionsMutation,
  useUpdateMultipleChoiceQuestionsMutation,
} from "~/services/api/services/formulaireApi/questionChoiceApi";
import { useUpdateSectionsMutation } from "~/services/api/services/formulaireApi/sectionApi";
import { fixListPositions, getElementById, isInFormElementsList } from "../utils";
import { PositionActionType } from "../enum";
import { toast } from "react-toastify";
import { useCallback } from "react";

export const useFormElementActions = (formElementsList: IFormElement[], formId: string) => {
  const { t } = useTranslation(FORMULAIRE);

  const [createSingleQuestion] = useCreateSingleQuestionMutation();
  const [createQuestions] = useCreateQuestionsMutation();
  const [updateQuestions] = useUpdateQuestionsMutation();
  const [updateSections] = useUpdateSectionsMutation();
  const [updateFormElements] = useUpdateFormElementsMutation();
  const [updateMultipleChoiceQuestions] = useUpdateMultipleChoiceQuestionsMutation();
  const [createMultipleChoiceQuestions] = useCreateMultipleChoiceQuestionsMutation();

  const updateFormElementsList = async (newFormElementsList: IFormElement[]) => {
    const questions = newFormElementsList.filter(isFormElementQuestion) as IQuestion[];
    const sections = newFormElementsList.filter(isFormElementSection) as ISection[];

    if (!newFormElementsList.length) {
      return [];
    }

    if (questions.length && !sections.length) {
      await updateQuestions(questions);
      return;
    }
    if (questions.length && !sections.length) {
      await updateSections(sections);
      return;
    }

    await updateFormElements(newFormElementsList);
    return;
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

  return {
    duplicateQuestion,
    saveQuestion,
  };
};
