import { IFormElement } from "~/core/models/formElement/types";
import { getStringifiedFormElementIdType, isQuestion, isSection } from "~/core/models/formElement/utils";
import { IQuestion } from "~/core/models/question/types";
import { getNextFormElement } from "~/core/models/question/utils";
import { IResponse } from "~/core/models/response/type";
import { getNextFormElementPosition } from "~/core/models/section/utils";

export const getNextPositionIfValid = (
  currentElement: IFormElement,
  responsesMap: Map<string, Map<number, IResponse[]>>,
  formElements: IFormElement[],
): number | null | undefined => {
  if (!currentElement.position) return NaN;

  const nextPosition = currentElement.position + 1; // Default value if no conditional logic applies
  let conditionalQuestion = null;
  let response: IResponse | null = null;

  if (isQuestion(currentElement) && currentElement.conditional) {
    conditionalQuestion = currentElement;
    response = calculateResponseValue(conditionalQuestion, responsesMap);
  } else if (isSection(currentElement)) {
    const conditionalQuestions = currentElement.questions.filter((q) => q.conditional);
    if (conditionalQuestions.length === 1) {
      conditionalQuestion = conditionalQuestions[0];
      response = calculateResponseValue(conditionalQuestion, responsesMap);
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
  responsesMap: Map<string, Map<number, IResponse[]>>,
) => {
  const questionIdType = getStringifiedFormElementIdType(conditionalQuestion);
  if (questionIdType) {
    const currentResponsesMap = responsesMap.get(questionIdType);
    const currentResponses =
      currentResponsesMap && conditionalQuestion.id ? currentResponsesMap.get(conditionalQuestion.id) : null;
    return currentResponses?.find((r) => r.choiceId != null && r.selected) ?? null;
  }
  return null;
};
