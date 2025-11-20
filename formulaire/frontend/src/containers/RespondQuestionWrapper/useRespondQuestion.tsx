import { FormElementType } from "~/core/models/formElement/enum";
import { createStringifiedFormElementIdType, getStringifiedFormElementIdType } from "~/core/models/formElement/utils";
import { IQuestion } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";
import { useResponse } from "~/providers/ResponseProvider";

export const useRespondQuestion = (question: IQuestion) => {
  const { responsesMap, setResponsesMap } = useResponse();

  const getQuestionResponses = (): IResponse[] => {
    const questionId = question.id;
    const sectionId = question.sectionId;
    const formElementIdType = sectionId
      ? createStringifiedFormElementIdType(sectionId, FormElementType.SECTION)
      : getStringifiedFormElementIdType(question);
    if (!formElementIdType || !questionId) return [];

    const questionResponsesMap = responsesMap.get(formElementIdType);
    return questionResponsesMap?.get(questionId)?.slice() ?? [];
  };

  const updateQuestionResponses = (newResponses: IResponse[]) => {
    const questionId = question.id;
    const sectionId = question.sectionId;
    const formElementIdType = sectionId
      ? createStringifiedFormElementIdType(sectionId, FormElementType.SECTION)
      : getStringifiedFormElementIdType(question);
    if (!formElementIdType || !questionId) return;

    setResponsesMap((prev) => {
      const newResponsesMap = new Map(prev);
      const newQuestionResponsesMap = new Map(newResponsesMap.get(formElementIdType) || []);
      newQuestionResponsesMap.set(questionId, newResponses);
      newResponsesMap.set(formElementIdType, newQuestionResponsesMap);
      return newResponsesMap;
    });
  };

  return { getQuestionResponses, updateQuestionResponses };
};
