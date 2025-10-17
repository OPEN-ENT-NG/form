import { Button, TextField, Typography, DialogTitle, DialogContent, DialogActions } from "@cgi-learning-hub/ui";
import { FC, useMemo, useState } from "react";
import {
  folderModalContentStyle,
  folderModalStyle,
  folderModalTextFieldLabelStyle,
  folderModalTextFieldStyle,
} from "./style";
import { FolderModalMode, IFolderModalProps } from "./types";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { useHome } from "~/providers/HomeProvider";
import { useCreateFolderMutation, useUpdateFolderMutation } from "~/services/api/services/formulaireApi/folderApi";
import { ICreateFolderPayload, IUpdateFolderPayload } from "~/core/models/folder/types";
import { isEnterPressed } from "~/core/utils";
import { ResponsiveDialog } from "~/components/ResponsiveDialog";

export const FolderModal: FC<IFolderModalProps> = ({ isOpen, handleClose, mode }) => {
  const { currentFolder, selectedFolders } = useHome();
  const { t } = useTranslation(FORMULAIRE);
  const [newName, setNewName] = useState<string>(mode === FolderModalMode.RENAME ? selectedFolders[0]?.name : "");
  const [createFolder] = useCreateFolderMutation();
  const [updateFolder] = useUpdateFolderMutation();

  const modeConfig = useMemo(() => {
    const handleRename = () => {
      if (!selectedFolders[0] || !selectedFolders[0].parent_id) return;
      const updatedFolder: IUpdateFolderPayload = {
        id: selectedFolders[0].id,
        parent_id: selectedFolders[0].parent_id,
        name: newName,
      };
      void updateFolder(updatedFolder);
      setNewName("");
      handleClose();
    };

    const handleCreate = () => {
      const parentId = currentFolder.id;
      const folder: ICreateFolderPayload = {
        parent_id: parentId,
        name: newName,
      };
      void createFolder(folder);
      setNewName("");
      handleClose();
    };

    return {
      [FolderModalMode.CREATE]: {
        i18nTitle: "formulaire.folder.create",
        i18nButtonText: "formulaire.create",
        handleAction: handleCreate,
      },
      [FolderModalMode.RENAME]: {
        i18nTitle: "formulaire.folder.rename",
        i18nButtonText: "formulaire.rename",
        handleAction: handleRename,
      },
    };
  }, [currentFolder, newName, createFolder, updateFolder, handleClose, selectedFolders]);

  const currentConfig = modeConfig[mode];

  const handleOnEnterPressed = (e: React.KeyboardEvent) => {
    e.preventDefault();
    currentConfig.handleAction();
  };

  return (
    <ResponsiveDialog
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
          onChange={(e) => {
            setNewName(e.target.value);
          }}
          onKeyDown={(e) => {
            if (isEnterPressed(e)) handleOnEnterPressed(e);
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          {t("formulaire.cancel")}
        </Button>
        <Button variant="contained" color="primary" onClick={currentConfig.handleAction} disabled={!newName}>
          {t(currentConfig.i18nButtonText)}
        </Button>
      </DialogActions>
    </ResponsiveDialog>
  );
};
