import { FC } from "react";
import { Box, EmptyState } from "@cgi-learning-hub/ui";
import { useCreation } from "~/providers/CreationProvider";
import { ICreationLayoutProps } from "./types";
import { CreationLayoutWrapper, emptyStateWrapper } from "./style";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { Button } from "@mui/material";
import { ComponentVariant } from "~/core/style/themeProps";
import { EmptyForm } from "~/components/SVG/EmptyForm";

export const CreationLayout: FC<ICreationLayoutProps> = ({ headerHeight }) => {
  const { form, formElementsList } = useCreation();
  const { t } = useTranslation(FORMULAIRE);
  if (!form) {
    return;
  }
  const handleNewFormElement = () => {
    //TODO: implement the logic to add a new form element
    console.log("New form element");
  };

  return (
    <CreationLayoutWrapper headerHeight={headerHeight}>
      {formElementsList.length <= 0 && (
        <Box sx={emptyStateWrapper}>
          <EmptyState
            image={<EmptyForm />}
            title={t("formulaire.form.edit.empty.main")}
            description={t("formulaire.form.edit.empty.caption")}
            color="primary.main"
            imageHeight={350}
          />
          <Button variant={ComponentVariant.CONTAINED} onClick={handleNewFormElement}>
            {t("formulaire.add.element")}
          </Button>
        </Box>
      )}
    </CreationLayoutWrapper>
  );
};
