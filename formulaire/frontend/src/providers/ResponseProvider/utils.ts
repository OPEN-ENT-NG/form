import { IFormElement } from "~/core/models/formElement/types";
import { getStringifiedFormElementIdType, isQuestion, isSection } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";
import { createNewResponse } from "~/core/models/response/utils";

export const initResponsesMap = (formElements: IFormElement[]) => {
  const responsesMap = new Map<string, Map<number, IResponse[]>>();

  formElements.forEach((formElement) => {
    const formElementIdType = getStringifiedFormElementIdType(formElement);
    if (!formElementIdType) return;
    const formElementResponsesMap = new Map<number, IResponse[]>();

    if (isQuestion(formElement) && formElement.id) {
      if (formElement.questionType === QuestionTypes.MATRIX) {
        formElement.children?.forEach((child) => {
          if (!child.id) return;
          formElementResponsesMap.set(child.id, initResponseAccordingToType(child, formElement.choices));
        });
      } else {
        formElementResponsesMap.set(formElement.id, initResponseAccordingToType(formElement));
      }
    } else if (isSection(formElement)) {
      formElement.questions.forEach((question) => {
        if (!question.id) return;
        if (question.questionType === QuestionTypes.MATRIX) {
          question.children?.forEach((child) => {
            if (!child.id) return;
            formElementResponsesMap.set(child.id, initResponseAccordingToType(child, question.choices));
          });
        } else {
          formElementResponsesMap.set(question.id, initResponseAccordingToType(question));
        }
      });
    }

    responsesMap.set(formElementIdType, formElementResponsesMap);
  });
  return responsesMap;
};

export const initResponseAccordingToType = (question: IQuestion, choices?: IQuestionChoice[] | null): IResponse[] => {
  if (!question.id) return [];
  const questionChoices = choices ?? question.choices;
  switch (question.questionType) {
    case QuestionTypes.SHORTANSWER:
    case QuestionTypes.LONGANSWER:
    case QuestionTypes.DATE:
    case QuestionTypes.TIME:
    case QuestionTypes.CURSOR:
      return [createNewResponse(question.id)];
    case QuestionTypes.SINGLEANSWER:
    case QuestionTypes.RANKING:
    case QuestionTypes.SINGLEANSWERRADIO:
    case QuestionTypes.MULTIPLEANSWER:
      return (
        questionChoices?.map((choice, index) =>
          createNewResponse(question.id as number, undefined, choice.id as number, choice.value, index),
        ) ?? []
      );
    case QuestionTypes.FILE:
      return [];
    default:
      return [];
  }
};
