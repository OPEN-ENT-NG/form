import { IFormElement } from "~/core/models/formElement/types";
import { IResponse } from "~/core/models/response/type";
import { Dispatch, SetStateAction } from "react";
import { getStringifiedFormElementIdType, isQuestion, isSection } from "~/core/models/formElement/utils";
import { initResponseAccordingToType } from "../utils";

export const usePreviewResponse = (
  setResponsesMap: Dispatch<SetStateAction<Map<string, Map<number, IResponse[]>>>>,
) => {
  const initResponsesMap = (formElements: IFormElement[]) => {
    const responsesMap = new Map();
    formElements.map((formElement) => {
      const formElementResponsesMap = new Map();

      if (isQuestion(formElement)) {
        const questionResponses = initResponseAccordingToType(formElement);
        formElementResponsesMap.set(formElement.id, questionResponses);
      }

      if (isSection(formElement)) {
        formElement.questions.map((question) => {
          const questionResponses = initResponseAccordingToType(question);
          formElementResponsesMap.set(question.id, questionResponses);
        });
      }

      responsesMap.set(getStringifiedFormElementIdType(formElement), formElementResponsesMap);
    });
    setResponsesMap(responsesMap);
  };

  return {
    initResponsesMap,
  };
};
