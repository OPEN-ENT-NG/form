import { FC } from "react";
import { Box, EmptyState, Button } from "@cgi-learning-hub/ui";
import { useCreation } from "~/providers/CreationProvider";
import { ICreationLayoutProps } from "./types";
import { CreationLayoutWrapper, emptyStateWrapper } from "./style";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { EmptyForm } from "~/components/SVG/EmptyForm";
import { useGlobal } from "~/providers/GlobalProvider";
import { ModalType } from "~/core/enums";
import { CreationMainLayout } from "../CreationMainLayout";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";

export const CreationLayout: FC<ICreationLayoutProps> = ({ headerHeight }) => {
  const { form, formElementsList } = useCreation();
  const { t } = useTranslation(FORMULAIRE);

  const { toggleModal } = useGlobal();
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
            slotProps={{
              title: { color: TEXT_PRIMARY_COLOR, variant: TypographyVariant.H4 },
              description: { variant: TypographyVariant.BODY2 },
            }}
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
