import { FC } from "react";
import { Box, EmptyState } from "@cgi-learning-hub/ui";
import { useResponse } from "~/providers/ResponseProvider";
import { Header } from "~/components/Header";
import { ResponseLayout } from "../ResponseLayout";
import { useTranslation } from "react-i18next";
import { TypographyVariant } from "~/core/style/themeProps";
import { FORMULAIRE_PUBLIC } from "~/core/constants";
import { emptyStateWrapper } from "~/core/style/boxStyles";
import { ResponsePageType } from "~/core/enums";
import { RgpdLayout } from "../RgpdLayout";
import { DescriptionLayout } from "../DescriptionLayout";
import { RecapLayout } from "../RecapLayout";
import { SECONDARY_MAIN_COLOR } from "~/core/style/colors";
import { ErrorPreview } from "~/components/SVG/ErrorPreview";

export const ResponseView: FC = () => {
  const { t } = useTranslation(FORMULAIRE_PUBLIC);
  const { form, formElementsList, pageType } = useResponse();

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
    if (!form || formElementsList.length <= 0) return errorPage;
    switch (pageType) {
      case ResponsePageType.RGPD:
        return <RgpdLayout />;
      case ResponsePageType.DESCRIPTION:
        return <DescriptionLayout />;
      case ResponsePageType.FORM_ELEMENT:
        return <ResponseLayout />;
      case ResponsePageType.RECAP:
        console.log("try displaying recap page !");
        return <></>;
      case ResponsePageType.END_PREVIEW:
        return <RecapLayout />;
      default:
        return errorPage;
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%", paddingX: "10%" }}>
      {form && <Header stringItems={[form.title]} buttons={[]} displaySeparator />}
      {displayRightPage()}
    </Box>
  );
};
