import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";
import { getStringifiedFormElementIdType, isQuestion, isSection } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";
import { createNewResponse } from "~/core/models/response/utils";

export const initResponsesMap = (formElements: IFormElement[]) => {
  const responsesMap = new Map<string, Map<number, IResponse[]>>();

  formElements.forEach((formElement) => {
    const formElementResponsesMap = new Map<IQuestion, IResponse[]>();

    if (isQuestion(formElement) && formElement.id) {
      if (formElement.questionType === QuestionTypes.MATRIX) {
        formElement.children?.forEach((child) => {
          if (!child.id) return;
          formElementResponsesMap.set(child, initResponseAccordingToType(child, formElement.choices));
        });
      } else {
        formElementResponsesMap.set(formElement, initResponseAccordingToType(formElement));
      }
    } else if (isSection(formElement)) {
      formElement.questions.forEach((question) => {
        if (!question.id) return;
        formElementResponsesMap.set(question, initResponseAccordingToType(question));
      });
    }

    formElementResponsesMap.forEach((responses, question) => {
      const formElementIdType = getStringifiedFormElementIdType(question);
      if (formElementIdType)
        responsesMap.set(formElementIdType, new Map<number, IResponse[]>().set(question.id ?? 0, responses));
    });
  });
  return responsesMap;
};

export const initResponseAccordingToType = (question: IQuestion, choices?: IQuestionChoice[] | null): IResponse[] => {
  if (!question.id) return [];
  const questionChoices = choices ?? question.choices;
  switch (question.questionType) {
    case QuestionTypes.SHORTANSWER:
    case QuestionTypes.LONGANSWER:
    case QuestionTypes.DATE:
    case QuestionTypes.TIME:
    case QuestionTypes.CURSOR:
    case QuestionTypes.SINGLEANSWER:
      return [createNewResponse(question.id)];
    case QuestionTypes.RANKING:
    case QuestionTypes.SINGLEANSWERRADIO:
    case QuestionTypes.MULTIPLEANSWER:
      return (
        questionChoices?.map((choice, index) =>
          createNewResponse(question.id as number, undefined, choice.id as number, choice.value, index),
        ) ?? []
      );
    default:
      return [];
  }
};

export const updateStorage = (formKey: string, form: IForm, formElements: IFormElement[]): void => {
  sessionStorage.setItem("formKey", JSON.stringify(formKey));
  sessionStorage.setItem("distributionKey", JSON.stringify(form.distribution_key));
  sessionStorage.setItem("distributionCaptcha", JSON.stringify(form.distribution_captcha));
  sessionStorage.setItem("form", JSON.stringify(form));
  sessionStorage.setItem("formElements", JSON.stringify(formElements));
  sessionStorage.setItem("nbFormElements", JSON.stringify(formElements.length));
  sessionStorage.setItem("historicPosition", JSON.stringify([1]));
  sessionStorage.setItem("allResponsesInfos", JSON.stringify(new Map()));
};
