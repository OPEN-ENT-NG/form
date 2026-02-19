import { Box, EmptyState } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { TypographyVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";

import { EmptyForm } from "../SVG/EmptyForm";
import { emptyStateWrapper } from "./style";
import { IErrorCodeProps } from "./types";

export const ErrorPage: FC<IErrorCodeProps> = ({ errorCode }) => {
  const getDescriptionKey = () => {
    switch (errorCode) {
      case 401:
      case 403:
        return "formulaire.public.end.sorry";
      default:
        return "formulaire.public.end.404";
    }
  };

  return (
    <Box sx={emptyStateWrapper}>
      <EmptyState
        image={<EmptyForm />}
        title={t("formulaire.public.error")}
        description={t(getDescriptionKey())}
        color="primary.main"
        imageHeight={300}
        slotProps={{
          title: { color: TEXT_PRIMARY_COLOR, variant: TypographyVariant.H4 },
          description: { variant: TypographyVariant.BODY2 },
        }}
      />
    </Box>
  );
};
