import { IDistribution } from "~/core/models/distribution/types";
import { DisplayContentType, StatusResponseType } from "./enums";
import { IStatusResponseState } from "./types";

export const initialStatusResponseState: IStatusResponseState = {
  isAnsweredActive: false,
  isNotAnsweredActive: true,
};

export const chipOptions = [
  {
    key: StatusResponseType.IS_ANSWERED_ACTIVE,
    label: "formulaire.checkremind.answered",
  },
  {
    key: StatusResponseType.IS_NOT_ANSWERED_ACTIVE,
    label: "formulaire.checkremind.notanswered",
  },
];

export const createFormUrl = (host: string | null, formId: number) => {
  if (!host) return null;
  return `${host}/formulaire?view=angular#/form/${formId.toString()}/new`;
};

export const chooseContent = (
  isDistributionsLoading: boolean,
  distributions: IDistribution[] | undefined,
  showRemind: boolean,
) => {
  if (isDistributionsLoading) {
    return DisplayContentType.LOADING;
  }
  if (!distributions?.length) {
    return DisplayContentType.NO_DISTRIBUTIONS;
  }
  if (!showRemind) {
    return DisplayContentType.FOLLOW;
  }
  return DisplayContentType.WRITE_REMIND;
};
