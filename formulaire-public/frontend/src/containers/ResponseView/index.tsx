import { Box, EmptyState, Loader } from "@cgi-learning-hub/ui";
import { FC, useMemo } from "react";

import { Header } from "~/components/Header";
import { ErrorPreview } from "~/components/SVG/ErrorPreview";
import { ResponsePageType } from "~/core/enums";
import { emptyStateWrapper } from "~/core/style/boxStyles";
import { SECONDARY_MAIN_COLOR } from "~/core/style/colors";
import { TypographyVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useResponse } from "~/providers/ResponseProvider";

import { CaptchaLayout } from "../CaptchaLayout";
import { DescriptionLayout } from "../DescriptionLayout";
import { RecapLayout } from "../RecapLayout";
import { ResponseLayout } from "../ResponseLayout";
import { RgpdLayout } from "../RgpdLayout";

export const ResponseView: FC = () => {
  const { form, formElementsList, pageType } = useResponse();
  const isNotReady = useMemo(() => {
    return !form || formElementsList.length <= 0;
  }, [form, formElementsList]);

  const errorPage = (
    <Box sx={emptyStateWrapper}>
      <EmptyState
        image={<ErrorPreview />}
        color={SECONDARY_MAIN_COLOR}
        title=""
        description={t("formulaire.public.end.404")}
        imageHeight={300}
        slotProps={{ title: { variant: TypographyVariant.H4 }, description: { variant: TypographyVariant.BODY2 } }}
      />
    </Box>
  );

  const displayRightPage = () => {
    if (isNotReady) return <Loader />;
    switch (pageType) {
      case ResponsePageType.RGPD:
        return <RgpdLayout />;
      case ResponsePageType.DESCRIPTION:
        return <DescriptionLayout />;
      case ResponsePageType.FORM_ELEMENT:
        return <ResponseLayout />;
      case ResponsePageType.RECAP:
        return <RecapLayout />;
      case ResponsePageType.CAPTCHA:
        return <CaptchaLayout />;
      default:
        return errorPage;
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%", paddingX: "10%", ...(isNotReady && { margin: "auto" }) }}>
      {form && !isNotReady && <Header items={[form.title]} buttons={[]} form={form} displaySeparator />}
      {displayRightPage()}
    </Box>
  );
};
