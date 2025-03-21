import { Box, Button } from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { toasterWrapper } from "./style";
import { ToasterProps } from "./types";
import { flexEndBoxStyle, flexStartBoxStyle } from "~/styles/boxStyles";

export const Toaster: FC<ToasterProps> = ({ leftButtons, rightButtons }) => {
  const { t } = useTranslation(FORMULAIRE);
  return (
    <Box sx={toasterWrapper}>
      <Box sx={flexStartBoxStyle}>
        {leftButtons.map((item) => (
          <Button key={item.titleI18nkey} color="primary" sx={{ color: "common.white" }} onClick={item.action}>
            {t(item.titleI18nkey)}
          </Button>
        ))}
      </Box>
      <Box sx={flexEndBoxStyle}>
        {rightButtons.map((item) => (
          <Button key={item.titleI18nkey} color="primary" sx={{ color: "common.white" }} onClick={item.action}>
            {t(item.titleI18nkey)}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
