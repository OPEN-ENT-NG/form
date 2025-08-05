import { FC } from "react";
import { Box, EmptyState, Button } from "@cgi-learning-hub/ui";
import { useCreation } from "~/providers/CreationProvider";
import { ICreationLayoutProps } from "./types";
import { CreationLayoutWrapper, emptyStateWrapper } from "./style";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant } from "~/core/style/themeProps";
import { EmptyForm } from "~/components/SVG/EmptyForm";
import { useModal } from "~/providers/ModalProvider";
import { ModalType } from "~/core/enums";
import { CreationMainLayout } from "../CreationMainLayout";

export const CreationLayout: FC<ICreationLayoutProps> = ({ headerHeight }) => {
  const { form, formElementsList } = useCreation();
  console.log("formElementsList", formElementsList);
  const { t } = useTranslation(FORMULAIRE);

  const { toggleModal } = useModal();
  if (!form) {
    return;
  }
  const handleNewFormElement = () => {
    toggleModal(ModalType.FORM_ELEMENT_CREATE);
  };

  return (
    <CreationLayoutWrapper headerHeight={headerHeight}>
      {!formElementsList.length ? (
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
          <Button variant={ComponentVariant.CONTAINED} onClick={handleNewFormElement}>
            {t("formulaire.add.element")}
          </Button>
        </Box>
      ) : (
        <CreationMainLayout />
      )}
    </CreationLayoutWrapper>
  );
};
