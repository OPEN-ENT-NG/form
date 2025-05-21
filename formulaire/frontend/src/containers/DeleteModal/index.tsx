import { IModalProps } from "~/core/types";
import { FC, useCallback } from "react";
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, TRASH_FOLDER_ID } from "~/core/constants";
import { deleteModalStyle } from "./style";
import { useHome } from "~/providers/HomeProvider";
import { getText, getTitle } from "./utils";
import { useDeleteFoldersMutation } from "~/services/api/services/formulaireApi/folderApi";
import {
  useDeleteFormMutation,
  useMoveFormsMutation,
  useUpdateFormMutation,
} from "~/services/api/services/formulaireApi/formApi";
import { PRIMARY } from "~/core/style/colors";
import { ComponentVariant, TypographyFont, TypographyVariant } from "~/core/style/themeProps";
import { IForm, IFormPayload } from "~/core/models/form/types";
import { toast } from "react-toastify";

export const DeleteModal: FC<IModalProps> = ({ isOpen, handleClose }) => {
  const { selectedForms, selectedFolders, resetSelected, currentFolder } = useHome();
  const { t } = useTranslation(FORMULAIRE);
  const [deleteFolders] = useDeleteFoldersMutation();
  const [moveForm] = useMoveFormsMutation();
  const [updateForm] = useUpdateFormMutation();
  const [deleteForm] = useDeleteFormMutation();

  const archiveForm = useCallback(
    async (form: IForm, destinationFolderId: number) => {
      const movedForms = await moveForm({
        formIds: [form.id],
        destinationFolderId,
      }).unwrap();

      if (movedForms.length) {
        await updateForm({
          formId: form.id.toString(),
          payload: { ...(form as unknown as IFormPayload), archived: true },
          hasToastDisplay: false,
        });
      }
    },
    [moveForm, updateForm],
  );

  const handleDelete = async () => {
    try {
      if (selectedFolders.length) {
        await deleteFolders(selectedFolders.map((folder) => folder.id));
      }

      if (!selectedForms.length) {
        resetSelected();
        handleClose();
        return;
      }

      const promises = selectedForms
        .filter((form) => form.id)
        .map((form) => {
          if (currentFolder.id === TRASH_FOLDER_ID) {
            return deleteForm(form.id);
          }
          return archiveForm(form, TRASH_FOLDER_ID);
        });

      await Promise.allSettled(promises);

      if (currentFolder.id !== TRASH_FOLDER_ID) {
        toast.success(t("formulaire.success.forms.archive"));
      }
      if (currentFolder.id === TRASH_FOLDER_ID) {
        toast.success(t("formulaire.success.forms.delete", { ns: FORMULAIRE }));
      }

      resetSelected();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(t("formulaire.error.delete"));
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: deleteModalStyle,
        },
      }}
    >
      <DialogTitle>
        <Typography variant={TypographyVariant.H2} fontWeight={TypographyFont.BOLD}>
          {t(getTitle(selectedForms, selectedFolders))}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography>{t(getText(selectedForms, selectedFolders))}</Typography>
      </DialogContent>

      <DialogActions>
        <Button variant={ComponentVariant.OUTLINED} color={PRIMARY} onClick={handleClose}>
          {t("formulaire.close")}
        </Button>
        <Button variant={ComponentVariant.CONTAINED} color={PRIMARY} onClick={() => void handleDelete()}>
          {t("formulaire.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
