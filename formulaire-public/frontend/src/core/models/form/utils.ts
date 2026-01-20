import { FormPropField } from "~/core/enums";
import { IFormPropInputValueState, IPublicFormDTO } from "./types";
import { IFormPayload, IForm } from "./types";
import { IDistribution } from "../distribution/types";
import { getFirstDistribution, getLatestDistribution, getNbFinishedDistrib } from "../distribution/utils";
import { DistributionStatus } from "../distribution/enums";
import { t } from "~/i18n";
import { transformFormElements } from "../formElement/utils";

export const transformPublicForm = (raw: IPublicFormDTO): IForm => {
  return {
    ...raw,
    formElements: transformFormElements(raw.form_elements),
  };
};

export const buildFormPayload = (
  formPropValue: IFormPropInputValueState,
  folderId: number,
  form: IForm | null,
): IFormPayload => {
  return {
    anonymous: formPropValue[FormPropField.IS_ANONYMOUS],
    archived: form?.archived ?? false,
    collab: form?.collab ?? false,
    date_creation: form?.date_creation ?? null,
    date_ending: formPropValue[FormPropField.DATE_ENDING]?.toISOString() ?? null,
    date_modification: form?.date_modification ?? null,
    date_opening: formPropValue[FormPropField.DATE_OPENING].toISOString(),
    description: formPropValue[FormPropField.DESCRIPTION],
    editable: formPropValue[FormPropField.IS_EDITABLE],
    folder_id: folderId,
    id: form?.id ?? null,
    is_public: formPropValue[FormPropField.IS_PUBLIC],
    multiple: formPropValue[FormPropField.IS_MULTIPLE],
    nb_responses: form?.nb_responses ?? 0,
    owner_id: form?.owner_id ?? null,
    owner_name: form?.owner_name ?? null,
    picture: formPropValue[FormPropField.PICTURE],
    public_key: form?.public_key ?? null,
    reminded: form?.reminded ?? false,
    response_notified: formPropValue[FormPropField.IS_RESPONSE_NOTIFIED],
    rgpd: formPropValue[FormPropField.HAS_RGPD],
    rgpd_goal: formPropValue[FormPropField.RGPD_GOAL],
    rgpd_lifetime: formPropValue[FormPropField.RGPD_LIFE_TIME],
    selected: null,
    sent: form?.sent ?? false,
    title: formPropValue[FormPropField.TITLE],
    is_progress_bar_disabled: formPropValue[FormPropField.IS_PROGRESS_BAR_DISABLED],
  };
};

export const parseFormToValueState = (form: IForm): IFormPropInputValueState => {
  return {
    [FormPropField.TITLE]: form.title,
    [FormPropField.DESCRIPTION]: form.description ?? "",
    [FormPropField.PICTURE]: form.picture ?? "",
    [FormPropField.DATE_OPENING]: form.date_opening ? new Date(form.date_opening) : new Date(),
    [FormPropField.DATE_ENDING]: form.date_ending ? new Date(form.date_ending) : null,
    [FormPropField.IS_MULTIPLE]: form.multiple,
    [FormPropField.IS_ANONYMOUS]: form.anonymous,
    [FormPropField.IS_EDITABLE]: form.editable,
    [FormPropField.IS_PUBLIC]: form.is_public,
    [FormPropField.IS_RESPONSE_NOTIFIED]: form.response_notified,
    [FormPropField.HAS_RGPD]: form.rgpd,
    [FormPropField.IS_PROGRESS_BAR_DISABLED]: form.is_progress_bar_disabled,
    [FormPropField.RGPD_GOAL]: form.rgpd_goal ?? "",
    [FormPropField.RGPD_LIFE_TIME]: form.rgpd_lifetime,
  };
};

export const isSelectedForm = (form: IForm, selectedForms: IForm[]): boolean => {
  return selectedForms.some((selectedForm) => selectedForm.id === form.id);
};

export const getFormDistributions = (form: IForm, distributions: IDistribution[]): IDistribution[] => {
  return distributions.filter((distribution) => distribution.formId === form.id);
};

export const isFormFilled = (form: IForm, distributions: IDistribution[]): boolean => {
  const formDistributions = getFormDistributions(form, distributions);

  if (form.multiple) {
    return getFirstDistribution(formDistributions).status === DistributionStatus.FINISHED;
  }
  return getNbFinishedDistrib(formDistributions) > 0;
};

export const getFormNbResponsesText = (nbResponses: number) => {
  const text = t(nbResponses > 1 ? "formulaire.responses" : "formulaire.response");
  return `${nbResponses.toString()} ${text}`;
};

export const getFormStatusText = (
  form: IForm,
  distributions: IDistribution[],
  formatDateWithTime: (date: string | Date | undefined, i18nTextKey: string) => string,
): string => {
  const formDistributions = getFormDistributions(form, distributions);
  if (form.multiple) {
    return `${t("formulaire.responses.count")} : ${getNbFinishedDistrib(formDistributions).toString()}`;
  } else {
    if (getNbFinishedDistrib(formDistributions) > 0) {
      const latestDistrib = getLatestDistribution(formDistributions);
      if (latestDistrib.dateResponse) {
        return formatDateWithTime(latestDistrib.dateResponse, "formulaire.responded.date");
      }
    }
    return t("formulaire.responded.waiting");
  }
};

export const hasFormResponses = (form: IForm): boolean => {
  return !!form.nb_responses;
};

// export const setFromJson = (form: IForm, data: IFormPublicData): void => {
//   for (const key in data) {
//     form[key] = data[key];
//     if (key === "nb_responses" && !data[key]) {
//       form[key] = 0;
//     }
//     if (
//       (key === "date_creation" || key === "date_modification" || key === "date_opening" || key === "date_ending") &&
//       data[key]
//     ) {
//       form[key] = new Date(form[key]);
//     }
//   }
// };

// export const formatFormElements = (form: IForm, formElements: IFormElement[]): void => {
//   for (const e of form["form_elements"]) {
//     if (!e["questions"]) {
//       formElements.push(formatIntoQuestion(e));
//     } else {
//       formElements.push(formatIntoSection(e));
//     }
//   }
//   formElements.sort((a, b) => a.position - b.position);
//   delete form["form_elements"];
// };

// const formatIntoSection = (e: IFormElement): ISection => {
//   const questions = new Questions();
//   if (e["questions"]) {
//     for (const q of e["questions"]) {
//       questions.push(formatIntoQuestion(q));
//     }
//   }
//   questions.sort((a, b) => a.section_position - b.section_position);

//   const section = Mix.castAs(Section, e);
//   section.questions = questions;
//   return section;
// };

// const formatIntoQuestion = (e: IFormElement): IQuestion => {
//   const choices = new QuestionChoices();
//   const children = new Questions();
//   if (e[Fields.CHOICES]) {
//     choices = Mix.castArrayAs(QuestionChoice, e[Fields.CHOICES]);
//     choices.sort((a, b) => a.position - b.position);
//   }
//   if (e[Fields.CHILDREN]) {
//     children = Mix.castArrayAs(Question, e[Fields.CHILDREN]); // Ok because matrix children cannot not have choices or children themselves
//     children.sort((a, b) => a.matrix_position - b.matrix_position);
//   }

//   const question = Mix.castAs(Question, e);
//   if (question.question_type === Types.CURSOR) formatIntoQuestionCursor(question, e);

//   question.choices = choices;
//   question.children = children;
//   return question;
// };

// const formatIntoQuestionCursor = (q: IQuestion, e: IFormElement): void => {
//   q.specific_fields = new QuestionSpecificFields(q.id);
//   q.specific_fields.cursor_min_val = e[Fields.SPECIFIC_FIELDS][Fields.CURSOR_MIN_VAL];
//   q.specific_fields.cursor_max_val = e[Fields.SPECIFIC_FIELDS][Fields.CURSOR_MAX_VAL];
//   q.specific_fields.cursor_step = e[Fields.SPECIFIC_FIELDS][Fields.CURSOR_STEP];
//   q.specific_fields.cursor_min_label = e[Fields.SPECIFIC_FIELDS][Fields.CURSOR_MIN_LABEL];
//   q.specific_fields.cursor_max_label = e[Fields.SPECIFIC_FIELDS][Fields.CURSOR_MAX_LABEL];
// };

// export const getDistributionKey = (form: IForm): string => {
//   const distributionKey = form[Fields.DISTRIBUTION_KEY].toString();
//   delete form[Fields.DISTRIBUTION_KEY];
//   return distributionKey;
// };

// export const getDistributionCaptcha = (): string => {
//   const distributionCaptcha = this[Fields.DISTRIBUTION_CAPTCHA].toString();
//   delete this[Fields.DISTRIBUTION_CAPTCHA];
//   return distributionCaptcha;
// };
