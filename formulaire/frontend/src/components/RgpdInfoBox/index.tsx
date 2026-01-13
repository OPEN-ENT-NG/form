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

  const delegatesHTML = params.delegates.map((delegate) =>
    formatI18n("formulaire.prop.rgpd.description.delegates", [
      delegate.rectoratName,
      delegate.rectoratEmail,
      delegate.rectoratAddress,
      delegate.rectoratPostalCode,
      delegate.rectoratCity,
    ]),
  );

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
      <Box component="ul" sx={{ py: 0, m: 0, pl: 2 }}>
        {delegatesHTML.map((rectoratHTML, index) => (
          <Box key={index} component="li" sx={{ py: 0.5 }} dangerouslySetInnerHTML={{ __html: rectoratHTML }} />
        ))}
      </Box>
    </Box>
  );
};

export default RGPDInfoBox;
