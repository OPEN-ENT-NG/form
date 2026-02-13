import { Dispatch } from "react";

import { FormElementType } from "~/core/models/formElement/enum";
import { createStringifiedFormElementIdType, getStringifiedFormElementIdType } from "~/core/models/formElement/utils";
import { IQuestion } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";

export const useRespondQuestion = (
  responsesMap: Map<string, Map<number, IResponse[]>>,
  setResponsesMap: Dispatch<React.SetStateAction<Map<string, Map<number, IResponse[]>>>>,
) => {
  const getQuestionResponses = (question: IQuestion, matrixQuestion?: IQuestion): IResponse[] => {
    const questionId = question.id;
    const sectionId = matrixQuestion ? matrixQuestion.sectionId : question.sectionId;
    const formElementIdType = sectionId
      ? createStringifiedFormElementIdType(sectionId, FormElementType.SECTION)
      : getStringifiedFormElementIdType(matrixQuestion ?? question);
    if (!formElementIdType || !questionId) return [];

    const questionResponsesMap = responsesMap.get(formElementIdType);
    const responses = questionResponsesMap?.get(questionId);
    return responses ? responses.map((r) => ({ ...r })) : [];
  };

  const getQuestionResponse = (question: IQuestion): IResponse | null => {
    const responses = getQuestionResponses(question);
    return responses.length ? { ...responses[0] } : null;
  };

  const updateQuestionResponses = (question: IQuestion, newResponses: IResponse[], matrixQuestion?: IQuestion) => {
    const questionId = question.id;
    const sectionId = matrixQuestion ? matrixQuestion.sectionId : question.sectionId;
    const formElementIdType = sectionId
      ? createStringifiedFormElementIdType(sectionId, FormElementType.SECTION)
      : getStringifiedFormElementIdType(matrixQuestion ?? question);
    if (!formElementIdType || !questionId) return;

    setResponsesMap((prev) => {
      const newResponsesMap = new Map(prev);
      const newQuestionResponsesMap = new Map(newResponsesMap.get(formElementIdType) || []);
      newQuestionResponsesMap.set(questionId, newResponses);
      newResponsesMap.set(formElementIdType, newQuestionResponsesMap);
      return newResponsesMap;
    });
  };

  return { getQuestionResponses, getQuestionResponse, updateQuestionResponses };
};
