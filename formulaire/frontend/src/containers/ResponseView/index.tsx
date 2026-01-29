import { Box, Button, EmptyState } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Header } from "~/components/Header";
import { ErrorPreview } from "~/components/SVG/ErrorPreview";
import { FORMULAIRE } from "~/core/constants";
import { ResponsePageType } from "~/core/enums";
import { emptyStateWrapper } from "~/core/style/boxStyles";
import { SECONDARY_MAIN_COLOR } from "~/core/style/colors";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { useResponse } from "~/providers/ResponseProvider";

import { DescriptionLayout } from "../DescriptionLayout";
import { EndPreviewLayout } from "../EndPreviewLayout";
import { ResponseLayout } from "../ResponseLayout";
import { useGetResponseHeaderButtons } from "../ResponseView/utils";
import { RgpdLayout } from "../RgpdLayout";

export const ResponseView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const { form, formElementsList, isInPreviewMode, pageType } = useResponse();
  const headerButtons = useGetResponseHeaderButtons(form?.id, isInPreviewMode);

  const errorPage = (
    <Box sx={emptyStateWrapper}>
      <EmptyState
        image={<ErrorPreview />}
        color={SECONDARY_MAIN_COLOR}
        title=""
        description={t("formulaire.preview.error")}
        imageHeight={300}
        slotProps={{ title: { variant: TypographyVariant.H4 }, description: { variant: TypographyVariant.BODY2 } }}
      />
      <Button variant={ComponentVariant.CONTAINED} onClick={headerButtons[0].action}>
        {t("formulaire.return")}
      </Button>
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
        return <EndPreviewLayout />;
      default:
        return errorPage;
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%", paddingX: "10%" }}>
      {form && (
        <Header
          items={[form.title]}
          buttons={formElementsList.length && pageType != ResponsePageType.END_PREVIEW ? headerButtons : []}
          form={form}
          displaySeparator
        />
      )}
      {displayRightPage()}
    </Box>
  );
};
