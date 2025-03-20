import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@cgi-learning-hub/ui";
import CloseIcon from "@mui/icons-material/Close";
import { FC, useMemo, useState } from "react";
import { modalBoxStyle, spaceBetweenBoxStyle } from "~/core/style/boxStyles";
import {
  folderModalContentStyle,
  folderModalStyle,
  folderModalTextFieldLabelStyle,
  folderModalTextFieldStyle,
} from "./style";
import { modalActionButtonStyle } from "~/core/style/modalStyle";
import { FOLDER_MODAL_MODE, FolderModalProps } from "./types";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { useHome } from "~/providers/HomeProvider";
import {
  useCreateFolderMutation,
  useUpdateFolderMutation,
} from "~/services/api/services/folderApi";
import {
  CreateFolderPayload,
  UpdateFolderPayload,
} from "~/core/models/folder/types";

export const FolderModal: FC<FolderModalProps> = ({
  isOpen,
  handleClose,
  mode,
}) => {
  const { currentFolder } = useHome();
  const { t } = useTranslation(FORMULAIRE);
  const [newName, setNewName] = useState<string>("");
  const [createFolder] = useCreateFolderMutation();
  const [updateFolder] = useUpdateFolderMutation();

  const modeConfig = useMemo(() => {
    const handleRename = () => {
      if (!currentFolder || !currentFolder.parent_id) return;
      const updatedFolder: UpdateFolderPayload = {
        id: currentFolder.id,
        parent_id: currentFolder.parent_id,
        name: newName,
      };
      updateFolder(updatedFolder);
      setNewName("");
      handleClose();
    };

    const handleCreate = () => {
      const parent_id = currentFolder ? currentFolder.id : 1;
      const folder: CreateFolderPayload = {
        parent_id: parent_id,
        name: newName,
      };
      createFolder(folder);
      setNewName("");
      handleClose();
    };

    return {
      [FOLDER_MODAL_MODE.CREATE]: {
        title: "formulaire.folder.create",
        buttonText: "formulaire.create",
        handleAction: handleCreate,
      },
      [FOLDER_MODAL_MODE.RENAME]: {
        title: "formulaire.folder.rename",
        buttonText: "formulaire.rename",
        handleAction: handleRename,
      },
    };
  }, [currentFolder, newName, createFolder, updateFolder, handleClose]);

  const currentConfig = modeConfig[mode] || modeConfig.CREATE;

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={{ ...modalBoxStyle, ...folderModalStyle }}>
        <Box sx={spaceBetweenBoxStyle}>
          <Typography variant="h2" fontWeight="bold">
            {t(currentConfig.title)}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={folderModalContentStyle}>
          <Typography sx={folderModalTextFieldLabelStyle}>
            {t("formulaire.folder.name")}
          </Typography>
          <TextField
            variant="standard"
            sx={folderModalTextFieldStyle}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </Box>
        <Box sx={modalActionButtonStyle}>
          <Button variant="outlined" color="primary" onClick={handleClose}>
            {t("formulaire.cancel")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={currentConfig.handleAction}
          >
            {t(currentConfig.buttonText)}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
