import { IFormElement } from "~/core/models/formElement/types";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { IQuestion } from "~/core/models/question/types";
import { getNextFormElement } from "~/core/models/question/utils";
import { IResponse } from "~/core/models/response/type";
import { getNextFormElementPosition } from "~/core/models/section/utils";

//TODO à revoir
export const getNextPositionIfValid = (
  currentElement: IFormElement,
  currentResponsesMap: Map<IQuestion, IResponse[]>,
  formElements: IFormElement[],
): number | null | undefined => {
  if (!currentElement.position) return NaN;

  const nextPosition = currentElement.position + 1; // Default value if no conditional logic applies
  let conditionalQuestion = null;
  let response: IResponse | null = null;

  if (isQuestion(currentElement) && currentElement.conditional) {
    conditionalQuestion = currentElement;
    const currentResponses = currentResponsesMap.get(conditionalQuestion);
    response = currentResponses && currentResponses.length > 0 ? currentResponses[0] : null;
  } else if (isSection(currentElement)) {
    const conditionalQuestions = currentElement.questions.filter((q) => q.conditional);
    if (conditionalQuestions.length === 1) {
      conditionalQuestion = conditionalQuestions[0];
      const currentResponses = currentResponsesMap.get(conditionalQuestion);
      response = currentResponses && currentResponses.length > 0 ? currentResponses[0] : null;
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
