import { Box, Button } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { toasterButtonStyle, toasterWrapper } from "./style";
import { IToasterProps } from "./types";
import { flexStartBoxStyle, flexEndBoxStyle } from "~/core/style/boxStyles";

export const Toaster: FC<IToasterProps> = ({ leftButtons, rightButtons }) => {
  const { t } = useTranslation(FORMULAIRE);
  return (
    <Box sx={toasterWrapper}>
      <Box sx={flexStartBoxStyle}>
        {leftButtons.map((item) => (
          <Button key={item.titleI18nkey} color="primary" sx={toasterButtonStyle} onClick={item.action}>
            {t(item.titleI18nkey)}
          </Button>
        ))}
      </Box>
      <Box sx={flexEndBoxStyle}>
        {rightButtons.map((item) => (
          <Button key={item.titleI18nkey} color="primary" sx={toasterButtonStyle} onClick={item.action}>
            {t(item.titleI18nkey)}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
