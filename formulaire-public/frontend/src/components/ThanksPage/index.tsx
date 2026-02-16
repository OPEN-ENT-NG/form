import { Box, EmptyState } from "@cgi-learning-hub/ui";

import { TypographyVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";

import { emptyStateWrapper } from "../ErrorPage/style";
import { ThanksSVG } from "../SVG/ThanksSVG";

export default function ThanksPage() {
  return (
    <Box sx={emptyStateWrapper}>
      <EmptyState
        image={<ThanksSVG />}
        title={t("formulaire.public.end.thanks")}
        color="primary.main"
        imageHeight={300}
        slotProps={{
          title: { variant: TypographyVariant.H1 },
        }}
      />
    </Box>
  );
}
