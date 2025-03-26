import { ModalProps } from "~/types";
import { FC, useCallback } from "react";
import { Box, Button, IconButton, Modal, Typography } from "@cgi-learning-hub/ui";
import CloseIcon from "@mui/icons-material/Close";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";
import { modalActionButtonStyle } from "~/core/style/modalStyle";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, TRASH_FOLDER_ID } from "~/core/constants";
import { deleteModalStyle } from "./style";
import { useHome } from "~/providers/HomeProvider";
import { getText, getTitle } from "./utils";
import { useDeleteFoldersMutation } from "~/services/api/services/formulaireApi/folderApi";
import {
  useDeleteFormMutation,
  useMoveFormMutation,
  useUpdateFormMutation,
} from "~/services/api/services/formulaireApi/formApi";
import { PRIMARY } from "~/core/style/colors";
import { ComponentVariant, TypographyFont, TypographyVariant } from "~/core/style/themeProps";
import { Form, FormPayload } from "~/core/models/form/types";
import { toast } from "react-toastify";

export const DeleteModal: FC<ModalProps> = ({ isOpen, handleClose }) => {
  const { selectedForms, selectedFolders, resetSelected, currentFolder } = useHome();
  const { t } = useTranslation(FORMULAIRE);
  const [deleteFolders] = useDeleteFoldersMutation();
  const [moveForm] = useMoveFormMutation();
  const [updateForm] = useUpdateFormMutation();
  const [deleteForm] = useDeleteFormMutation();

  const archiveForm = useCallback(
    async (form: Form, destinationFolderId: number) => {
      const movedForms = await moveForm({
        formIds: [form.id],
        destinationFolderId,
      }).unwrap();

      if (movedForms.length) {
        await updateForm({
          formId: form.id.toString(),
          payload: { ...(form as unknown as FormPayload), archived: true },
          hasToastDisplay: false,
        });
      }
    },
    [moveForm, updateForm],
  );

  const handleDelete = useCallback(() => {
    if (selectedFolders.length) {
      deleteFolders(selectedFolders.map((folder) => folder.id));
    }
    if (!selectedForms.length) {
      return handleClose();
    }

    selectedForms.forEach((form) => {
      if (!form.id) return;

      if (currentFolder.id === TRASH_FOLDER_ID) {
        deleteForm(form.id);
        return;
      }

      return archiveForm(form, TRASH_FOLDER_ID);
    });

    if (currentFolder.id !== TRASH_FOLDER_ID) toast.success(t("formulaire.success.forms.archive"));
    resetSelected();
    return handleClose();
  }, [deleteFolders, deleteForm, archiveForm, handleClose, selectedFolders, selectedForms]);

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={deleteModalStyle}>
        <Box sx={spaceBetweenBoxStyle}>
          <Typography variant={TypographyVariant.H2} fontWeight={TypographyFont.BOLD}>
            {t(getTitle(selectedForms, selectedFolders))}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>
          <Typography>{t(getText(selectedForms, selectedFolders))}</Typography>
        </Box>
        <Box sx={modalActionButtonStyle}>
          <Button variant={ComponentVariant.OUTLINED} color={PRIMARY} onClick={handleClose}>
            {t("formulaire.close")}
          </Button>
          <Button variant={ComponentVariant.CONTAINED} color={PRIMARY} onClick={handleDelete}>
            {t("formulaire.delete")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
