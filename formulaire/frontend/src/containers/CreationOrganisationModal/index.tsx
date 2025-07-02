import { FC, ReactNode } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Stack } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant } from "~/core/style/themeProps";
import { IModalProps } from "~/core/types";
import { useCreation } from "~/providers/CreationProvider";
import { isFormElementSection } from "~/core/models/section/utils";
import { ISection } from "~/core/models/section/types";
import { OrganizationDraggableItem } from "~/components/OrganizationDraggableItem";
import { IFormElement } from "~/core/models/formElement/types";
import { contentStackStyle } from "./style";
import { flattenFormElements } from "~/core/models/formElement/utils";

export const CreationOrganisationModal: FC<IModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { formElementsList, updateFormElementsList } = useCreation();

  const handleConfirm = () => {
    void updateFormElementsList(flattenFormElements(formElementsList));
    handleClose();
  };

  // Recursively render each element + its questions
  const renderElements = (elements: IFormElement[], depth = 0): ReactNode =>
    elements.map((el) => (
      <Box key={el.id}>
        <OrganizationDraggableItem element={el} indent={depth * 4} />

        {isFormElementSection(el) &&
          (el as ISection).questions.length > 0 &&
          renderElements((el as ISection).questions, depth + 1)}
      </Box>
    ));

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle>{t("formulaire.organize")}</DialogTitle>
      <DialogContent>
        <Stack sx={contentStackStyle}>{renderElements(formElementsList)}</Stack>
      </DialogContent>
      <DialogActions>
        <Button variant={ComponentVariant.OUTLINED} onClick={handleClose}>
          {t("formulaire.cancel")}
        </Button>
        <Button variant={ComponentVariant.CONTAINED} onClick={handleConfirm}>
          {t("formulaire.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
