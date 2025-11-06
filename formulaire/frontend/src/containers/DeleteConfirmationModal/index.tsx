import { FC } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant, TypographyFontStyle, TypographyVariant } from "~/core/style/themeProps";
import { IDeleteConfirmationModalProps } from "./types";
import { useCreation } from "~/providers/CreationProvider";
import { useFormElementActions } from "~/providers/CreationProvider/hook/useFormElementActions";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";

export const DeleteConfirmationModal: FC<IDeleteConfirmationModalProps> = ({ isOpen, handleClose, element }) => {
  const { t } = useTranslation(FORMULAIRE);
  const {
    formElementsList,
    form,
    currentEditingElement,
    handleDeleteFormElement,
    setFormElementsList,
    setCurrentEditingElement,
  } = useCreation();

  if (!form) {
    throw new Error("form is undefined");
  }
  const { deleteFormElement } = useFormElementActions(
    formElementsList,
    String(form.id),
    currentEditingElement,
    setFormElementsList,
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
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
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
