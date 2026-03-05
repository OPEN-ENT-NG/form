import dayjs, { isDayjs } from "dayjs";

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
  // If it's a FREETEXT we keep it
  if (isQuestion(formElement) && formElement.questionType === QuestionTypes.FREETEXT) return true;

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
  return allResponses.reduce<IResponse[]>((acc, r) => {
    if (!r.questionId) return acc;
    const question = allQuestionsAndChildren.find((q) => q.id === r.questionId);
    if (!question || (isQuestionUsingSelectedProp(question.questionType) && !r.selected)) return acc;
    if (question.questionType === QuestionTypes.DATE) {
      let formattedDate = null;
      if (r.answer instanceof Date) formattedDate = dayjs(r.answer);
      else if (isDayjs(r.answer)) formattedDate = r.answer;
      else if (typeof r.answer === "string") {
        const d = new Date(r.answer);
        if (!isNaN(d.getTime())) formattedDate = dayjs(d);
      }
      return [...acc, { ...r, answer: formattedDate?.toDate().toLocaleDateString() }];
    }
    return [...acc, r];
  }, []);
};

const isQuestionUsingSelectedProp = (questionType: QuestionTypes) => {
  return (
    questionType === QuestionTypes.SINGLEANSWER ||
    questionType === QuestionTypes.SINGLEANSWERRADIO ||
    questionType === QuestionTypes.MULTIPLEANSWER
  );
};

export const hasMissingMandatoryResponses = (formElements: IFormElement[], responses: IResponse[]): boolean => {
  const mandatoryQuestions = getAllQuestions(formElements).filter((q) => q.mandatory);
  return mandatoryQuestions.some((question) => {
    if (question.questionType === QuestionTypes.MATRIX) {
      return question.children?.some((child) => !responses.some((r) => r.questionId === child.id && r.answer));
    }

    return !responses.some((r) => r.questionId === question.id && isResponseStringValid(r));
  });
};

const isResponseStringValid = (response: IResponse): boolean => {
  if (response.answer) return response.answer.toString().trim().length > 0;
  if (response.customAnswer) return response.customAnswer.trim().length > 0;
  return false;
};
