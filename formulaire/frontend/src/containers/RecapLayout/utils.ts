import { IFormElement } from "~/core/models/formElement/types";
import { getAllQuestions } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IResponse } from "~/core/models/response/type";

export const checkMandatoryQuestions = (formElements: IFormElement[], responses: IResponse[]): boolean => {
  const mandatoryQuestions = getAllQuestions(formElements);
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
