import { SxProps, Theme } from "@cgi-learning-hub/ui";
import { Dayjs } from "dayjs";

export interface RGPDI18nParams {
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

export interface RGPDInfoBoxProps {
  params: RGPDI18nParams;
  sx?: SxProps<Theme>;
}
