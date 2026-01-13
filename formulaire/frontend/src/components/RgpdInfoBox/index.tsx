/* eslint-disable @typescript-eslint/naming-convention */
import { FC } from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { IRGPDInfoBoxProps } from "./types";
import { FORMULAIRE } from "~/core/constants";
import { DateFormat } from "~/core/enums";
import { TEXT_SECONDARY_COLOR } from "~/core/style/colors";

const RGPDInfoBox: FC<IRGPDInfoBoxProps> = ({ params, hideBorder, sx = { color: TEXT_SECONDARY_COLOR } }) => {
  const { t } = useTranslation(FORMULAIRE);

  const formattedDate = dayjs(params.expirationDate).format(DateFormat.DAY_MONTH_YEAR);

  const formatI18n = (key: string, params: string[]): string => {
    return params.reduce((translatedText, param, index) => {
      const placeholder = `{{${index.toString()}}}`;
      return translatedText.replace(placeholder, param);
    }, t(key));
  };

  const introHTML = formatI18n("formulaire.prop.rgpd.description.intro", [params.finalite, formattedDate]);

  const rectoratHTML = formatI18n("formulaire.prop.rgpd.description.delegates", [
    params.rectoratName,
    params.rectoratEmail,
    params.rectoratAddress,
    params.rectoratPostalCode,
    params.rectoratCity,
  ]);

  const villeHTML = formatI18n("formulaire.prop.rgpd.description.delegates", [
    params.villeName,
    params.villeEmail,
    "",
    "",
    "",
  ]);

  return (
    <Box
      sx={{
        ...(!hideBorder && { border: "1px solid #ddd", borderRadius: 1, p: 2 }),

        fontSize: "1.5rem",
        "& .left-spacing": {
          paddingLeft: "20px",
        },
        ...sx,
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: introHTML }} />
      <ul>
        <li dangerouslySetInnerHTML={{ __html: rectoratHTML }} />
        <li dangerouslySetInnerHTML={{ __html: villeHTML }} />
      </ul>
    </Box>
  );
};

export default RGPDInfoBox;
