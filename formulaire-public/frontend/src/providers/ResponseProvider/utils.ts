import { IForm, IPublicFormDTO } from "~/core/models/form/types";
import { FormElementType } from "~/core/models/formElement/enum";
import { IFormElement, IFormElementDTO } from "~/core/models/formElement/types";
import { getStringifiedFormElementIdType, isQuestion, isSection } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion, IQuestionChoice, IQuestionDTO } from "~/core/models/question/types";
import { transformQuestion } from "~/core/models/question/utils";
import { IResponse } from "~/core/models/response/type";
import { createNewResponse } from "~/core/models/response/utils";
import { ISection, ISectionDTO } from "~/core/models/section/types";
import { transformSection } from "~/core/models/section/utils";

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

function parseQuestion(formElementDTO: IQuestionDTO): IQuestion {
  const question = transformQuestion(formElementDTO);
  return {
    ...question,
    choices: formElementDTO.choices as IQuestionChoice[],
    children: (formElementDTO.children ?? []).map((question) => parseQuestion(question)),
  };
}

function parseSection(formElementDTO: ISectionDTO): ISection {
  const section = transformSection(formElementDTO);
  return {
    ...section,
    questions: formElementDTO.questions.map(parseQuestion),
  };
}

function parseFormElement(formElementDTO: IFormElementDTO): ISection | IQuestion {
  if (formElementDTO.form_element_type === FormElementType.SECTION) {
    return parseSection(formElementDTO as ISectionDTO);
  }
  return parseQuestion(formElementDTO as IQuestionDTO);
}

export const parseFormDatas = (formDatas: IPublicFormDTO): IForm => {
  const parsedFormElements = formDatas.form_elements
    .map(parseFormElement)
    .sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity));

  return {
    ...formDatas,
    formElements: parsedFormElements,
  };
};
