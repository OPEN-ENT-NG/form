import { IFormElement } from "~/core/models/formElement/types";
import { getStringifiedFormElementIdType, isQuestion, isSection } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";
import { createNewResponse } from "~/core/models/response/utils";

export const initResponsesMap = (formElements: IFormElement[]) => {
  const responsesMap = new Map<string, Map<number, IResponse[]>>();

  formElements.forEach((formElement) => {
    const formElementResponsesMap = new Map<number, IResponse[]>();

    if (isQuestion(formElement) && formElement.id) {
      formElementResponsesMap.set(formElement.id, initResponseAccordingToType(formElement));
    } else if (isSection(formElement)) {
      formElement.questions.forEach((question) => {
        if (!question.id) return;
        formElementResponsesMap.set(question.id, initResponseAccordingToType(question));
      });
    }

    const formElementIdType = getStringifiedFormElementIdType(formElement);
    if (formElementIdType) responsesMap.set(formElementIdType, formElementResponsesMap);
  });
  return responsesMap;
};

export const initResponseAccordingToType = (question: IQuestion): IResponse[] => {
  if (!question.id) return [];
  switch (question.questionType) {
    case QuestionTypes.SHORTANSWER:
    case QuestionTypes.LONGANSWER:
    case QuestionTypes.DATE:
    case QuestionTypes.TIME:
    case QuestionTypes.CURSOR:
    case QuestionTypes.SINGLEANSWER:
    case QuestionTypes.SINGLEANSWERRADIO:
      return [createNewResponse(question.id)];
    case QuestionTypes.RANKING:
    case QuestionTypes.MULTIPLEANSWER:
      return question.choices
        ? question.choices.map((choice, index) =>
            createNewResponse(question.id as number, undefined, choice.id as number, choice.value, index),
          )
        : [];
    //TODO other question types
    case QuestionTypes.FILE:
      return [];
    case QuestionTypes.MATRIX:
      return [];
    default:
      return [];
  }
};
