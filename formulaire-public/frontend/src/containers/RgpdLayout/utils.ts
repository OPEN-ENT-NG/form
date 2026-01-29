import dayjs, { Dayjs } from "dayjs";

import { IRGPDData, IRGPDI18nParams } from "~/components/RgpdInfoBox/types";
import { IDelegate } from "~/core/models/delegate/types";
import { t } from "~/i18n";

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
