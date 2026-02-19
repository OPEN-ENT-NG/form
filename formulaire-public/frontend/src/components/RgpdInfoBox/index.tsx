/* eslint-disable @typescript-eslint/naming-convention */
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { FC } from "react";

import { DateFormat } from "~/core/enums";
import { TEXT_SECONDARY_COLOR } from "~/core/style/colors";
import { t } from "~/i18n";

import { IRGPDInfoBoxProps } from "./types";

const RGPDInfoBox: FC<IRGPDInfoBoxProps> = ({ params, hideBorder, sx = { color: TEXT_SECONDARY_COLOR } }) => {
  const formattedDate = dayjs(params.expirationDate).format(DateFormat.DAY_MONTH_YEAR);

  const formatI18n = (key: string, params: string[]): string => {
    return params.reduce((translatedText, param, index) => {
      const placeholder = `{{${index.toString()}}}`;
      return translatedText.replace(placeholder, param);
    }, t(key));
  };

  const introHTML = formatI18n("formulaire.public.prop.rgpd.description.intro", [params.finalite, formattedDate]);

  const delegatesHTML = params.delegates.map((delegate) =>
    formatI18n("formulaire.public.prop.rgpd.description.delegates", [
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
