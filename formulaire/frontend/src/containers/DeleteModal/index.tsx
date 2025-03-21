import { ModalProps } from "~/types";
import { FC, useCallback } from "react";
import { Box, Button, IconButton, Modal, Typography } from "@cgi-learning-hub/ui";
import CloseIcon from "@mui/icons-material/Close";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";
import { modalActionButtonStyle } from "~/core/style/modalStyle";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { deleteModalStyle } from "./style";
import { useHome } from "~/providers/HomeProvider";
import { getText, getTitle } from "./utils";
import { useDeleteFoldersMutation } from "~/services/api/services/formulaireApi/folderApi";
import { useDeleteFormMutation } from "~/services/api/services/formulaireApi/formApi";
import { PRIMARY } from "~/core/style/colors";
import { ComponentVariant, TypographyFont, TypographyVariant } from "~/core/style/themeProps";

export const DeleteModal: FC<ModalProps> = ({ isOpen, handleClose }) => {
  const { selectedForms, selectedFolders } = useHome();
  const { t } = useTranslation(FORMULAIRE);
  const [deleteFolders] = useDeleteFoldersMutation();
  const [deleteForm] = useDeleteFormMutation();

  const handleDelete = useCallback(() => {
    if (selectedFolders.length) {
      deleteFolders(selectedFolders.map((folder) => folder.id));
    }
    if (selectedForms.length) {
      selectedForms.forEach((form) => {
        if (form.id) {
          deleteForm(form.id);
        }
      });
    }
    return handleClose();
  }, [deleteFolders, deleteForm, handleClose, selectedFolders, selectedForms]);

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
