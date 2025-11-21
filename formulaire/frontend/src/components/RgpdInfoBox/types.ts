import { SxProps, Theme } from "@cgi-learning-hub/ui";
import { Dayjs } from "dayjs";

export interface IRGPDI18nParams {
  rectoratName: string;
  rectoratEmail: string;
  rectoratAddress: string;
  rectoratPostalCode: string;
  rectoratCity: string;
  villeName: string;
  villeEmail: string;
}

export interface IRGPDData {
  finalite: string;
  expirationDate: Dayjs;
  delegates: IRGPDI18nParams[];
}

export interface IRGPDInfoBoxProps {
  params: IRGPDI18nParams;
  hideBorder: boolean;
  sx?: SxProps<Theme>;
}
