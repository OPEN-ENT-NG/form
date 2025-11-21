import { FC } from "react";
import { Box, Button, EmptyState } from "@cgi-learning-hub/ui";
import { useResponse } from "~/providers/ResponseProvider";
import { Header } from "~/components/Header";
import { ResponseLayout } from "../ResponseLayout";
import { useGetCreationHeaderButtons } from "../ResponseView/utils";
import { useTranslation } from "react-i18next";
import { EmptyForm } from "~/components/SVG/EmptyForm";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { FORMULAIRE } from "~/core/constants";
import { emptyStateWrapper } from "~/core/style/boxStyles";
import { ResponsePageType } from "~/core/enums";
import { RgpdLayout } from "../RgpdLayout";

export const ResponseView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const { form, formElementsList, isInPreviewMode, pageType } = useResponse();
  const headerButtons = useGetCreationHeaderButtons(form?.id, isInPreviewMode);

  const errorPage = (
    <Box sx={emptyStateWrapper}>
      <EmptyState
        image={<EmptyForm />}
        title={t("formulaire.form.edit.empty.main")}
        description={t("formulaire.form.edit.empty.caption", { buttonText: t("formulaire.add.element") })}
        color="primary.main"
        imageHeight={300}
        slotProps={{ title: { variant: TypographyVariant.H4 }, description: { variant: TypographyVariant.BODY2 } }}
      />
      <Button variant={ComponentVariant.CONTAINED} onClick={headerButtons[0].action}>
        {headerButtons[0].title}
      </Button>
    </Box>
  );

  const displayRightPage = () => {
    if (!form || formElementsList.length <= 0) return errorPage;
    switch (pageType) {
      case ResponsePageType.RGPD:
        return <RgpdLayout />;
      case ResponsePageType.DESCRIPTION:
        console.log("try displaying description page !");
        return <></>;
      case ResponsePageType.FORM_ELEMENT:
        return <ResponseLayout />;
      case ResponsePageType.RECAP:
        console.log("try displaying recap page !");
        return <></>;
      default:
        return errorPage;
    }
  };

  //TODO update l'empty state (texts, image, buttons...) when the design will be ready
  return (
    <Box sx={{ width: "100%", height: "100%", paddingX: "10%" }}>
      {form && (
        <Header
          stringItems={[form.title]}
          buttons={formElementsList.length ? headerButtons : []}
          form={form}
          displaySeparator
        />
      )}
      {displayRightPage()}
    </Box>
  );
};
