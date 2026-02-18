import { IFormElement } from "~/core/models/formElement/types";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { IQuestion } from "~/core/models/question/types";
import { getNextFormElement } from "~/core/models/question/utils";
import { IResponse } from "~/core/models/response/type";
import { getNextFormElementPosition } from "~/core/models/section/utils";
import { IProgressProps, ResponseMap } from "~/providers/ResponseProvider/types";

export const getNextPositionIfValid = (
  currentElement: IFormElement,
  formElements: IFormElement[],
  getQuestionResponses: (question: IQuestion) => IResponse[],
): number | null | undefined => {
  if (!currentElement.position) return NaN;

  const nextPosition = currentElement.position + 1; // Default value if no conditional logic applies
  let conditionalQuestion = null;
  let response: IResponse | null = null;

  if (isQuestion(currentElement) && currentElement.conditional) {
    conditionalQuestion = currentElement;
    response = calculateResponseValue(conditionalQuestion, getQuestionResponses);
  } else if (isSection(currentElement)) {
    const conditionalQuestions = currentElement.questions.filter((q) => q.conditional);
    if (conditionalQuestions.length === 1) {
      conditionalQuestion = conditionalQuestions[0];
      response = calculateResponseValue(conditionalQuestion, getQuestionResponses);
    }
  }

  if (conditionalQuestion && (!response || !response.choiceId)) return undefined;

  if (conditionalQuestion && response) {
    const choices = conditionalQuestion.choices?.filter((c) => c.id === response.choiceId);
    if (!choices) return null;
    const targetedElement =
      choices.length === 1 ? getNextFormElement(choices[0], formElements, conditionalQuestion) : null;
    return targetedElement ? targetedElement.position : null;
  }

  if (isSection(currentElement) && currentElement.questions.filter((q) => q.conditional).length == 0) {
    return getNextFormElementPosition(currentElement, formElements);
  }

  return nextPosition;
};

const calculateResponseValue = (
  conditionalQuestion: IQuestion,
  getQuestionResponses: (question: IQuestion) => IResponse[],
): IResponse | null => {
  const responses = getQuestionResponses(conditionalQuestion);
  return responses.find((response) => response.selected) ?? null;
};

export const saveResponses = (progress: IProgressProps, responsesMap: ResponseMap): void => {
  sessionStorage.setItem("progress", JSON.stringify(progress));
  sessionStorage.setItem("responsesMap", serializeMap(responsesMap));
};

const serializeMap = (responsesMap: ResponseMap): string => {
  return JSON.stringify([...responsesMap].map(([k, v]) => [k, [...v]]));
};

export const deserializeMap = (storedResponsesMap: string): ResponseMap => {
  if (!storedResponsesMap) return new Map();

  const parsed = JSON.parse(storedResponsesMap) as [string, [number, IResponse[]][]][];

  return new Map<string, Map<number, IResponse[]>>(
    parsed.map(([key, values]) => [key, new Map<number, IResponse[]>(values)]),
  );
};
