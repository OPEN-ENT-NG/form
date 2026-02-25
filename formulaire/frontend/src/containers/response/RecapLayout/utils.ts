import { IFormElement } from "~/core/models/formElement/types";
import { getAllQuestions, isQuestion, isSection } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IResponse } from "~/core/models/response/type";

export const checkMandatoryQuestions = (formElements: IFormElement[], responses: IResponse[]): boolean => {
  const mandatoryQuestions = getAllQuestions(formElements).filter((q) => q.mandatory);
  const hasInvalidQuestion = mandatoryQuestions.some((question) => {
    if (question.questionType === QuestionTypes.MATRIX) {
      question.children?.forEach((child) => {
        if (!responses.some((r) => r.questionId === child.id && r.answer)) return false;
      });
    }

    return !responses.some((r) => r.questionId === question.id && isResponseStringValid(r));
  });

  return !hasInvalidQuestion;
};

const isResponseStringValid = (response: IResponse): boolean => {
  if (response.answer) return response.answer.toString().trim().length > 0;
  if (response.customAnswer) return response.customAnswer.trim().length > 0;
  return false;
};

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
