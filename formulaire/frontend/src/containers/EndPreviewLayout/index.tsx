import { FC } from "react";
import { Box, Button, Paper, Stack, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { useResponse } from "~/providers/ResponseProvider";
import { useNavigate } from "react-router-dom";
import { getFormEditPath } from "~/core/pathHelper";
import { endPreviewLayoutStyle, endPreviewStackStyle } from "./style";
import { SECONDARY_MAIN_COLOR } from "~/core/style/colors";

export const EndPreviewLayout: FC = () => {
  const { form } = useResponse();
  const { t } = useTranslation(FORMULAIRE);
  const navigate = useNavigate();

  return (
    <Box sx={endPreviewLayoutStyle}>
      <Stack component={Paper} sx={endPreviewStackStyle}>
        <Typography variant={TypographyVariant.H1} color={SECONDARY_MAIN_COLOR}>
          {t("formulaire.preview.end")}
        </Typography>
        <Button
          variant={ComponentVariant.OUTLINED}
          onClick={() => {
            if (form?.id) navigate(getFormEditPath(form.id));
          }}
        >
          {t("formulaire.backToEditor")}
        </Button>
      </Stack>
    </Box>
  );
};
