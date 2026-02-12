import { IFormElement } from "~/core/models/formElement/types";
import { getStringifiedFormElementIdType, isQuestion, isSection } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";
import { createNewResponse } from "~/core/models/response/utils";

import { ResponseMap } from "./types";

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
    case QuestionTypes.FILE:
      return [createNewResponse(question.id)];
    case QuestionTypes.SINGLEANSWER:
    case QuestionTypes.RANKING:
    case QuestionTypes.SINGLEANSWERRADIO:
    case QuestionTypes.MULTIPLEANSWER:
      return (
        questionChoices?.map((choice, index) =>
          createNewResponse(question.id as number, undefined, undefined, choice.id as number, choice.value, index),
        ) ?? []
      );
    default:
      return [];
  }
};

export const fillResponseMapWithRepsonses = (
  responseMap: ResponseMap,
  responses: IResponse[],
  questions: IQuestion[],
): ResponseMap => {
  const filledResponseMap = new Map<string, Map<number, IResponse[]>>();

  responseMap.forEach((formElementMap, feit) => {
    const newFormelementMap = new Map<number, IResponse[]>();

    formElementMap.forEach((existingResponses, questionId) => {
      const question = questions.find((q) => q.id === questionId);
      const questionType = question?.questionType;
      if (questionType === QuestionTypes.MATRIX) {
        question?.children?.forEach((child) => {
          if (!child.id) return;
          const matchingNewResponses = responses.filter((r) => r.questionId === child.id);
          const updatedResponses = updateResponsesByQuestionType(
            existingResponses,
            matchingNewResponses,
            child.questionType,
          );
          newFormelementMap.set(child.id, updatedResponses);
        });
      } else {
        const matchingNewResponses = responses.filter((r) => r.questionId === questionId);
        const updatedResponses = updateResponsesByQuestionType(existingResponses, matchingNewResponses, questionType);
        newFormelementMap.set(questionId, updatedResponses);
      }
    });

    filledResponseMap.set(feit, newFormelementMap);
  });

  return filledResponseMap;
};

const updateResponsesByQuestionType = (
  existingResponses: IResponse[],
  matchingNewResponses: IResponse[],
  questionType: QuestionTypes | undefined,
): IResponse[] => {
  if (
    questionType != QuestionTypes.FILE &&
    (!existingResponses.length || !matchingNewResponses.length || !questionType)
  )
    return existingResponses;

  switch (questionType) {
    case QuestionTypes.SHORTANSWER:
    case QuestionTypes.LONGANSWER:
    case QuestionTypes.DATE:
    case QuestionTypes.TIME:
    case QuestionTypes.FILE: {
      if (existingResponses.length != 1 || matchingNewResponses.length != 1) break;
      return matchingNewResponses;
    }
    case QuestionTypes.CURSOR: {
      if (existingResponses.length != 1 || matchingNewResponses.length != 1) break;
      const formattedAnswer = Number(matchingNewResponses[0].answer);
      if (isNaN(formattedAnswer)) break;
      return [{ ...matchingNewResponses[0], answer: formattedAnswer }];
    }
    case QuestionTypes.RANKING: {
      if (matchingNewResponses.some((r) => r.choicePosition == null)) break;
      return matchingNewResponses;
    }
    case QuestionTypes.SINGLEANSWER:
    case QuestionTypes.SINGLEANSWERRADIO: {
      if (matchingNewResponses.length != 1) break;
      const updatedResponses = [...existingResponses];
      return updatedResponses.map((r) => {
        if (r.choiceId === matchingNewResponses[0].choiceId) {
          return { ...matchingNewResponses[0], selected: true };
        }
        return r;
      });
    }
    case QuestionTypes.MULTIPLEANSWER: {
      const updatedResponses = [...existingResponses];
      return updatedResponses.map((r) => {
        const matchingResponse = matchingNewResponses.find((mr) => r.choiceId === mr.choiceId);
        if (matchingResponse) return { ...matchingResponse, selected: true };
        return r;
      });
    }
    default:
      return existingResponses;
  }

  return existingResponses;
};
