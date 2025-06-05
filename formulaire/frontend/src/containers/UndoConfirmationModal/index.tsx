import { FC } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant, TypographyFont, TypographyVariant } from "~/core/style/themeProps";
import { useCreation } from "~/providers/CreationProvider";
import { IUndoConfirmationModalProps } from "./types";

export const UndoConfirmationModal: FC<IUndoConfirmationModalProps> = ({ isOpen, handleClose, question }) => {
  const { t } = useTranslation(FORMULAIRE);

  const { setCurrentEditingElement, handleUndoQuestionsChange } = useCreation();

  const handleUndo = () => {
    handleUndoQuestionsChange(question);
    setCurrentEditingElement(null);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle variant={TypographyVariant.H2} fontWeight={TypographyFont.BOLD}>
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
