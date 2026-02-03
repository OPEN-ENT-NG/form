import { Box, Button, EmptyState } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { FORMULAIRE } from "~/core/constants";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";

import { EmptyForm } from "../SVG/EmptyForm";
import { emptyStateWrapper } from "./style";
import { IErrorCodeProps } from "./types";

export const ErrorPage: FC<IErrorCodeProps> = ({ errorCode }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { navigateToHome } = useFormulaireNavigation();

  const getDescriptionKey = () => {
    switch (errorCode) {
      case 401:
      case 403:
        return "formulaire.error.403";
      default:
        return "formulaire.error.404";
    }
  };

  return (
    <Box sx={emptyStateWrapper}>
      <EmptyState
        image={<EmptyForm />}
        title={t("formulaire.error")}
        description={t(getDescriptionKey())}
        color="primary.main"
        imageHeight={300}
        slotProps={{
          title: { color: TEXT_PRIMARY_COLOR, variant: TypographyVariant.H4 },
          description: { variant: TypographyVariant.BODY2 },
        }}
      />
      <Button
        variant={ComponentVariant.CONTAINED}
        onClick={() => {
          navigateToHome();
        }}
      >
        {t("formulaire.error.backToMenu")}
      </Button>
    </Box>
  );
};
