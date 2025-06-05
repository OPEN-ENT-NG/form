import { FC } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant, TypographyFont, TypographyVariant } from "~/core/style/themeProps";
import { useDeleteSingleQuestionMutation } from "~/services/api/services/formulaireApi/questionApi";
import { IDeleteConfirmationModalProps } from "./types";
import { removeFormElementFromList } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";

export const DeleteConfirmationModal: FC<IDeleteConfirmationModalProps> = ({ isOpen, handleClose, question }) => {
  const { t } = useTranslation(FORMULAIRE);
  const [deleteSingleQuestion] = useDeleteSingleQuestionMutation();
  const { formElementsList, setFormElementsList } = useCreation();

  const handleDelete = async () => {
    if (!question.id) {
      handleClose();
      return;
    }
    setFormElementsList(removeFormElementFromList(formElementsList, question));
    handleClose();
    await deleteSingleQuestion(question.id);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle variant={TypographyVariant.H2} fontWeight={TypographyFont.BOLD}>
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
