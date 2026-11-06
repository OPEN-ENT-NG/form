import dayjs, { Dayjs } from "dayjs";

import { IRGPDData, IRGPDI18nParams } from "~/components/RgpdInfoBox/types";
import { IDelegate } from "~/core/models/delegate/types";
import { t } from "~/i18n";

import { FormPropField } from "./enums";
import { IFormCheckBoxProp, IFormPropInputValueState } from "./types";

export const initialFormPropInputValueState: IFormPropInputValueState = {
  [FormPropField.TITLE]: "",
  [FormPropField.DESCRIPTION]: "",
  [FormPropField.PICTURE]: "",
  [FormPropField.DATE_OPENING]: new Date(),
  [FormPropField.DATE_ENDING]: null,
  [FormPropField.IS_MULTIPLE]: false,
  [FormPropField.IS_ANONYMOUS]: false,
  [FormPropField.IS_EDITABLE]: false,
  [FormPropField.IS_PUBLIC]: false,
  [FormPropField.IS_RESPONSE_NOTIFIED]: false,
  [FormPropField.HAS_RGPD]: false,
  [FormPropField.IS_PROGRESS_BAR_DISABLED]: false,
  [FormPropField.RGPD_GOAL]: "",
  [FormPropField.RGPD_LIFE_TIME]: 3,
};

export const formCheckBoxProps: IFormCheckBoxProp[] = [
  {
    i18nKey: "formulaire.prop.public.label",
    field: FormPropField.IS_PUBLIC,
    tooltip: "formulaire.prop.public.description",
  },
  {
    i18nKey: "formulaire.prop.multiple.label",
    field: FormPropField.IS_MULTIPLE,
  },
  {
    i18nKey: "formulaire.prop.editable.label",
    field: FormPropField.IS_EDITABLE,
  },
  {
    i18nKey: "formulaire.prop.anonymous.label",
    field: FormPropField.IS_ANONYMOUS,
    tooltip: "formulaire.prop.anonymous.description",
  },
  {
    i18nKey: "formulaire.prop.notified.label",
    field: FormPropField.IS_RESPONSE_NOTIFIED,
    tooltip: "formulaire.prop.notified.description",
  },
  {
    i18nKey: "formulaire.prop.progress.label",
    field: FormPropField.IS_PROGRESS_BAR_DISABLED,
  },
  {
    i18nKey: "formulaire.prop.description.label",
    field: FormPropField.DESCRIPTION,
  },
  {
    i18nKey: "formulaire.prop.rgpd.label",
    field: FormPropField.HAS_RGPD,
  },
];

export const rgpdGoalDurationOptions = [3, 6, 9, 12];

export const buildDelegatesParam = (
  delegates: IDelegate[] | null,
  rgpdGoal: string,
  expirationDate: Dayjs = dayjs(),
): IRGPDData => {
  const delegatesParams: IRGPDI18nParams[] =
    delegates && delegates.length > 0
      ? delegates.map((delegate) => ({
          rectoratName: delegate.entity,
          rectoratEmail: delegate.mail,
          rectoratAddress: delegate.address,
          rectoratPostalCode: delegate.zipcode ? delegate.zipcode.toString() : "",
          rectoratCity: delegate.city,
          villeName: delegate.entity,
          villeEmail: delegate.mail,
        }))
      : [];

  return {
    finalite: rgpdGoal.length ? rgpdGoal : t("formulaire.prop.rgpd.goal.default"),
    expirationDate: expirationDate,
    delegates: delegatesParams,
  };
};

// Compute the ending date to display in the modal, compared to the form's opening date
export const computeEndingDate = (openingDate: Date, savedEndingDate?: Date | string | null): Date => {
  if (!savedEndingDate) {
    const oneYearAfterOpening = new Date(openingDate);
    oneYearAfterOpening.setFullYear(oneYearAfterOpening.getFullYear() + 1);
    return oneYearAfterOpening;
  }

  const savedDate = new Date(savedEndingDate);
  // A closed form keeps its real (past) ending date
  if (savedDate > openingDate) return savedDate;

  const dayAfterOpening = new Date(openingDate);
  dayAfterOpening.setDate(dayAfterOpening.getDate() + 1);
  return dayAfterOpening;
};
