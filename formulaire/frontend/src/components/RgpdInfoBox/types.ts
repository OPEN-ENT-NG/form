import { SxProps, Theme } from "@cgi-learning-hub/ui";
import { Dayjs } from "dayjs";

export interface IRGPDI18nParams {
  finalite: string;
  expirationDate: Dayjs;
  rectoratName: string;
  rectoratEmail: string;
  rectoratAddress: string;
  rectoratPostalCode: string;
  rectoratCity: string;
  villeName: string;
  villeEmail: string;
}

export interface IRGPDInfoBoxProps {
  params: IRGPDI18nParams;
  hideBorder: boolean;
  sx?: SxProps<Theme>;
}
