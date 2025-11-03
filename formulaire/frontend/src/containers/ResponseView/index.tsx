import { FC } from "react";
import { Box, Button, EmptyState } from "@cgi-learning-hub/ui";
import { useResponse } from "~/providers/ResponseProvider";
import { Header } from "~/components/Header";
import { ResponseLayout } from "../ResponseLayout";
import { useGetCreationHeaderButtons } from "../ResponseView/utils";
import { useTranslation } from "react-i18next";
import { EmptyForm } from "~/components/SVG/EmptyForm";
import { ComponentVariant } from "~/core/style/themeProps";
import { FORMULAIRE } from "~/core/constants";
import { emptyStateWrapper } from "~/core/style/boxStyles";

export const ResponseView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const { form, formElementsList, isInPreviewMode } = useResponse();
  const headerButtons = useGetCreationHeaderButtons(form?.id, isInPreviewMode);

  //TODO update l'empty state (texts, image, buttons...) when the design will be ready
  return (
    <Box height="100%">
      {form && (
        <Header
          stringItems={[form.title]}
          buttons={formElementsList.length ? headerButtons : []}
          form={form}
          displaySeparator
        />
      )}
      {form && formElementsList.length > 0 && <ResponseLayout />}
      {(!form || !formElementsList.length) && (
        <Box sx={emptyStateWrapper}>
          <EmptyState
            image={<EmptyForm />}
            title={t("formulaire.form.edit.empty.main")}
            description={t("formulaire.form.edit.empty.caption", { buttonText: t("formulaire.add.element") })}
            color="primary.main"
            imageHeight={300}
            titleProps={{ variant: "h4" }}
            descriptionProps={{ variant: "body2" }}
          />
          <Button variant={ComponentVariant.CONTAINED} onClick={headerButtons[0].action}>
            {headerButtons[0].title}
          </Button>
        </Box>
      )}
    </Box>
  );
};
