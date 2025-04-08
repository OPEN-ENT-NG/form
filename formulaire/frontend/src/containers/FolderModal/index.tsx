import { Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@cgi-learning-hub/ui";
import { FC, useMemo, useState } from "react";
import {
  folderModalContentStyle,
  folderModalStyle,
  folderModalTextFieldLabelStyle,
  folderModalTextFieldStyle,
} from "./style";
import { FolderModalProps } from "./types";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, MYFORMS_FOLDER_ID } from "~/core/constants";
import { useHome } from "~/providers/HomeProvider";
import { useCreateFolderMutation, useUpdateFolderMutation } from "~/services/api/services/formulaireApi/folderApi";
import { CreateFolderPayload, UpdateFolderPayload } from "~/core/models/folder/types";
import { FOLDER_MODAL_MODE } from "./enum";

export const FolderModal: FC<FolderModalProps> = ({ isOpen, handleClose, mode }) => {
  const { currentFolder, selectedFolders } = useHome();
  const { t } = useTranslation(FORMULAIRE);
  const [newName, setNewName] = useState<string>("");
  const [createFolder] = useCreateFolderMutation();
  const [updateFolder] = useUpdateFolderMutation();

  const modeConfig = useMemo(() => {
    const handleRename = () => {
      if (!selectedFolders[0] || !selectedFolders[0].parent_id) return;
      const updatedFolder: UpdateFolderPayload = {
        id: selectedFolders[0].id,
        parent_id: selectedFolders[0].parent_id,
        name: newName,
      };
      updateFolder(updatedFolder);
      setNewName("");
      handleClose();
    };

    const handleCreate = () => {
      const parent_id = currentFolder ? currentFolder.id : MYFORMS_FOLDER_ID;
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
        i18nTitle: "formulaire.folder.create",
        i18nButtonText: "formulaire.create",
        handleAction: handleCreate,
      },
      [FOLDER_MODAL_MODE.RENAME]: {
        i18nTitle: "formulaire.folder.rename",
        i18nButtonText: "formulaire.rename",
        handleAction: handleRename,
      },
    };
  }, [currentFolder, newName, createFolder, updateFolder, handleClose, selectedFolders]);

  const currentConfig = modeConfig[mode] || modeConfig.CREATE;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: folderModalStyle,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h2" fontWeight="bold">
          {t(currentConfig.i18nTitle)}
        </Typography>
      </DialogTitle>

      <DialogContent sx={folderModalContentStyle}>
        <Typography sx={folderModalTextFieldLabelStyle}>{t("formulaire.folder.name")}</Typography>
        <TextField
          variant="standard"
          sx={folderModalTextFieldStyle}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          {t("formulaire.cancel")}
        </Button>
        <Button variant="contained" color="primary" onClick={currentConfig.handleAction}>
          {t(currentConfig.i18nButtonText)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
