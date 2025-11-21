import { FC } from "react";
import { Box, Button, Paper, Stack, Typography } from "@cgi-learning-hub/ui";
import { descriptionLayoutStyle, descriptionStackStyle } from "./style";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { useResponse } from "~/providers/ResponseProvider";
import { spaceBetweenBoxStyle } from "~/core/style/boxStyles";
import { ResponsePageType } from "~/core/enums";

export const DescriptionLayout: FC = () => {
  const { form, setPageType } = useResponse();
  const { t } = useTranslation(FORMULAIRE);

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
        <Button variant={ComponentVariant.CONTAINED} disabled>
          {t("formulaire.prev")}
        </Button>
        <Button variant={ComponentVariant.CONTAINED} onClick={goFirstFormElement}>
          {t("formulaire.next")}
        </Button>
      </Box>
    </Box>
  );
};
