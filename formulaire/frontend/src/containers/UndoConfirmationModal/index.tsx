import { FC } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant, TypographyFontStyle, TypographyVariant } from "~/core/style/themeProps";
import { useCreation } from "~/providers/CreationProvider";
import { IUndoConfirmationModalProps } from "./types";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { preventPropagation } from "~/providers/CreationProvider/utils";

export const UndoConfirmationModal: FC<IUndoConfirmationModalProps> = ({ isOpen, handleClose, element }) => {
  const { t } = useTranslation(FORMULAIRE);

  const { setCurrentEditingElement, handleUndoFormElementChange, handleDeleteFormElement } = useCreation();

  const handleUndo = () => {
    if (element.isNew) {
      handleDeleteFormElement(element);
      handleClose();
      return;
    }

    handleUndoFormElementChange(element);
    setCurrentEditingElement(null);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} onClick={preventPropagation} fullWidth>
      <DialogTitle color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H2} fontWeight={TypographyFontStyle.BOLD}>
        {t("formulaire.cancel")}
      </DialogTitle>
      <DialogContent>
        <Typography>{t("formulaire.element.undo.confirmation")}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant={ComponentVariant.OUTLINED} onClick={handleClose}>
          {t("formulaire.no")}
        </Button>
        <Button variant={ComponentVariant.CONTAINED} onClick={handleUndo}>
          {t("formulaire.yes")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
