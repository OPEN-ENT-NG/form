import { IFormElement } from "~/core/models/formElement/types";
import { getAllQuestions, getAllQuestionsAndChildren, isQuestion, isSection } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IResponse } from "~/core/models/response/type";
import { ResponseMap } from "~/providers/ResponseProvider/types";

export const getFormElementsToDisplay = (formElementsList: IFormElement[], responses: IResponse[]): IFormElement[] => {
  const questionIds = responses.map((r) => r.questionId);
  return formElementsList.filter((fe) => shouldDisplayElement(fe, questionIds));
};

const shouldDisplayElement = (formElement: IFormElement, responseQuestionIds: number[]): boolean => {
  // If id is in responses we keep it
  if (responseQuestionIds.includes(formElement.id ?? -1)) return true;

  // Else if it is a question we check if a child is in responses
  if (isQuestion(formElement)) {
    const childrenIds = formElement.children?.map((q) => q.id);
    return responseQuestionIds.some((id) => childrenIds?.includes(id));
  }

  // Else if it is a section we check everything above for each question of this section
  if (isSection(formElement)) {
    return formElement.questions.filter((q) => shouldDisplayElement(q, responseQuestionIds)).length > 0;
  }

  return false;
};

export const getResponses = (formElementsList: IFormElement[], responsesMap: ResponseMap): IResponse[] => {
  const allResponses = Array.from(responsesMap.values())
    .flatMap((innerMap) => Array.from(innerMap.values()))
    .flat();

  const allQuestionsAndChildren = getAllQuestionsAndChildren(formElementsList);
  allResponses.filter((r) => {
    if (!r.questionId) return false;
    const question = allQuestionsAndChildren.find((q) => q.id === r.questionId);
    if (!question || (isQuestionUsingSelectedProp(question.questionType) && !r.selected)) return false;
    return true;
  });

  return allResponses;
};

const isQuestionUsingSelectedProp = (questionType: QuestionTypes) => {
  return (
    questionType === QuestionTypes.SINGLEANSWER ||
    questionType === QuestionTypes.SINGLEANSWERRADIO ||
    questionType === QuestionTypes.MULTIPLEANSWER
  );
};
export const checkMandatoryQuestions = (formElements: IFormElement[], responses: IResponse[]): boolean => {
  const mandatoryQuestions = getAllQuestions(formElements).filter((q) => q.mandatory);
  mandatoryQuestions.forEach((question) => {
    if (question.questionType === QuestionTypes.MATRIX) {
      question.children?.forEach((child) => {
        if (!responses.some((r) => r.questionId === child.id && r.answer)) return false;
      });
    } else if (responses.filter((r) => r.questionId === question.id && isResponseStringValid(r)).length <= 0) {
      return false;
    }
  });

  return true;
};

const isResponseStringValid = (response: IResponse): boolean => {
  if (response.answer) return response.answer.toString().trim().length > 0;
  if (response.customAnswer) return response.customAnswer.trim().length > 0;
  return false;
};
