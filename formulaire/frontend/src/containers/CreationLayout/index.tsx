import { FC } from "react";
import { Box, EmptyState } from "@cgi-learning-hub/ui";
import { useCreation } from "~/providers/CreationProvider";
import { ICreationLayoutProps } from "./types";
import { CreationLayoutWrapper } from "./style";
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
    console.log("New form element");
  };

  // get Element with data-name = empty-form, then get its parent, and give it a hieght of 300px OR CHANGE LIBRARY
  const emptyFormElement = document.querySelector("[data-name='empty-form']");
  if (emptyFormElement) {
    const parentElement = emptyFormElement.parentElement;
    if (parentElement) {
      parentElement.style.height = "350px";
    }
  }
  
  return (
    <CreationLayoutWrapper headerHeight={headerHeight}>
      {formElementsList.length === 2 && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width={"100%"} gap={3}>
          <EmptyState
            image={<EmptyForm />}
            title={t("formulaire.form.edit.empty.main")}
            description={t("formulaire.form.edit.empty.caption")}
            color="primary.main"
          />
          <Button variant={ComponentVariant.CONTAINED} onClick={handleNewFormElement}>
            {t("formulaire.add.element")}
          </Button>
        </Box>
      )}
    </CreationLayoutWrapper>
  );
};
