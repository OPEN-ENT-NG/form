import { Box, Button, Paper, Stack, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { FORMULAIRE } from "~/core/constants";
import { SECONDARY_MAIN_COLOR } from "~/core/style/colors";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { useResponse } from "~/providers/ResponseProvider";

import { endPreviewLayoutStyle, endPreviewStackStyle } from "./style";

export const EndPreviewLayout: FC = () => {
  const { form } = useResponse();
  const { t } = useTranslation(FORMULAIRE);
  const { navigateToFormEdit } = useFormulaireNavigation();

  return (
    <Box sx={endPreviewLayoutStyle}>
      <Stack component={Paper} sx={endPreviewStackStyle}>
        <Typography variant={TypographyVariant.H1} color={SECONDARY_MAIN_COLOR}>
          {t("formulaire.preview.end")}
        </Typography>
        <Button
          variant={ComponentVariant.OUTLINED}
          onClick={() => {
            if (form?.id) navigateToFormEdit(form.id);
          }}
        >
          {t("formulaire.backToEditor")}
        </Button>
      </Stack>
    </Box>
  );
};
