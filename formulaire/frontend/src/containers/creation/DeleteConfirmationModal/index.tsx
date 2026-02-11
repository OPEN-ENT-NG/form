import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { FORMULAIRE } from "~/core/constants";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { ComponentVariant, TypographyFontStyle, TypographyVariant } from "~/core/style/themeProps";
import { useCreation } from "~/providers/CreationProvider";
import { useFormElementActions } from "~/providers/CreationProvider/hook/useFormElementActions";
import { preventPropagation } from "~/providers/CreationProvider/utils";

import { IDeleteConfirmationModalProps } from "./types";

export const DeleteConfirmationModal: FC<IDeleteConfirmationModalProps> = ({ isOpen, handleClose, element }) => {
  const { t } = useTranslation(FORMULAIRE);
  const {
    formElementsList,
    form,
    currentEditingElement,
    handleDeleteFormElement,
    setFormElementsList,
    setCurrentEditingElement,
    setIsUpdating,
  } = useCreation();

  if (!form) {
    throw new Error("form is undefined");
  }
  const { deleteFormElement } = useFormElementActions(
    formElementsList,
    String(form.id),
    currentEditingElement,
    setFormElementsList,
    setIsUpdating,
  );

  const handleDelete = async () => {
    setCurrentEditingElement(null);
    if (!element.id) {
      handleDeleteFormElement(element, true);
      handleClose();
      return;
    }
    handleDeleteFormElement(element);
    if (element.isNew) {
      return;
    }
    await deleteFormElement(element);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} onClick={preventPropagation} fullWidth>
      <DialogTitle color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H2} fontWeight={TypographyFontStyle.BOLD}>
        {t("formulaire.delete")}
      </DialogTitle>
      <DialogContent>
        <Typography>{t("formulaire.element.delete.confirmation")}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant={ComponentVariant.OUTLINED} onClick={handleClose}>
          {t("formulaire.cancel")}
        </Button>
        <Button
          variant={ComponentVariant.CONTAINED}
          onClick={() => {
            void handleDelete();
          }}
        >
          {t("formulaire.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
