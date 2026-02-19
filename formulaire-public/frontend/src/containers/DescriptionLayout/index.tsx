import { Box, Button, Paper, Stack, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { ResponsePageType } from "~/core/enums";
import { spaceBetweenBoxStyle } from "~/core/style/boxStyles";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useResponse } from "~/providers/ResponseProvider";

import { descriptionLayoutStyle, descriptionStackStyle } from "./style";

export const DescriptionLayout: FC = () => {
  const { form, setPageType } = useResponse();

  const goRgpd = () => {
    setPageType(ResponsePageType.RGPD);
    return;
  };

  const goFirstFormElement = () => {
    setPageType(ResponsePageType.FORM_ELEMENT);
    return;
  };

  return (
    <Box sx={descriptionLayoutStyle}>
      <Stack component={Paper} sx={descriptionStackStyle}>
        <Typography variant={TypographyVariant.H6}>{form?.title}</Typography>
        <Typography>{form?.description}</Typography>
      </Stack>
      <Box sx={spaceBetweenBoxStyle}>
        <Button variant={ComponentVariant.OUTLINED} onClick={goRgpd}>
          {t("formulaire.public.prev")}
        </Button>
        <Button variant={ComponentVariant.CONTAINED} onClick={goFirstFormElement}>
          {t("formulaire.public.next")}
        </Button>
      </Box>
    </Box>
  );
};
