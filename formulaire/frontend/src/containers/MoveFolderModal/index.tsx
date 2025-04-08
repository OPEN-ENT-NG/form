import { ModalProps } from "~/types";
import { FC, SyntheticEvent, useCallback, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TreeView,
  Typography,
  Button,
} from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, MYFORMS_FOLDER_ID } from "~/core/constants";
import { useHome } from "~/providers/HomeProvider";
import { Folder } from "~/core/models/folder/types";
import { Form } from "~/core/models/form/types";
import { buildFolderTree } from "./utils";
import { useMoveFormsMutation } from "~/services/api/services/formulaireApi/formApi";
import { useMoveFoldersMutation } from "~/services/api/services/formulaireApi/folderApi";
import { ComponentVariant, TypographyFont, TypographyVariant } from "~/core/style/themeProps";
import { moveMainTextStyle, treeviewContainerStyle, treeviewTextStyle } from "./style";

export const MoveFolderModal: FC<ModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { selectedFolders, selectedForms, currentFolder, folders, setSelectedForms, setSelectedFolders } = useHome();
  const [targetFolder, setTargetFolder] = useState(currentFolder);

  const [moveForms] = useMoveFormsMutation();
  const [moveFolders] = useMoveFoldersMutation();

  const treeViewItems = buildFolderTree(folders);
  const handleSelectedItemChange = useCallback(
    (event: SyntheticEvent, itemId: string | null) => {
      if (!itemId) {
        setTargetFolder(folders[0]);
        return;
      }
      const folderId = parseInt(itemId);

      if (!isNaN(folderId)) {
        const selectedFolder = folders.find((folder) => folder.id === folderId);
        if (selectedFolder) {
          setTargetFolder(selectedFolder);
        }
      }
    },
    [folders, setTargetFolder],
  );

  const handleMove = useCallback(() => {
    if (targetFolder) {
      const foldersToMove = selectedFolders
        .filter((folder) => folder.id !== targetFolder.id)
        .map((folder) => folder.id);
      const formsToMove = selectedForms.map((form) => form.id);

      try {
        if (foldersToMove.length) {
          moveFolders({
            folderIds: foldersToMove,
            parentId: targetFolder.id,
          });
        }
        if (formsToMove.length) {
          moveForms({
            formIds: formsToMove,
            destinationFolderId: targetFolder.id,
          });
        }
        setSelectedForms([]);
        setSelectedFolders([]);
      } catch (error) {
        console.error("Error moving items:", error);
      }
    }
    return handleClose();
  }, [moveForms, moveFolders, selectedFolders, selectedForms, targetFolder]);

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle variant={TypographyVariant.H2} fontWeight={TypographyFont.BOLD}>
        {t("formulaire.move.title")}
      </DialogTitle>
      <DialogContent>
        <Box>
          <Box sx={moveMainTextStyle}>
            <Typography variant={TypographyVariant.BODY1} marginRight={5} width={60}>
              {t("formulaire.move")}
            </Typography>
            <Box>
              {selectedForms.map((form: Form) => (
                <Typography key={form.id} variant={TypographyVariant.H6}>
                  {form.title}
                </Typography>
              ))}
              {selectedFolders.map((folder: Folder) => (
                <Typography key={folder.id} variant={TypographyVariant.H6}>
                  {folder.name}
                </Typography>
              ))}
            </Box>
          </Box>
          <Box>
            <Box sx={moveMainTextStyle}>
              <Typography variant={TypographyVariant.BODY1} marginRight={5} width={60}>
                {t("formulaire.to")}
              </Typography>
              <Typography key={targetFolder.id} variant={TypographyVariant.H6}>
                {targetFolder.name}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Typography variant={TypographyVariant.BODY1} sx={treeviewTextStyle}>
            {t("formulaire.move.folder.tree")}
          </Typography>
        </Box>

        <Box sx={treeviewContainerStyle}>
          <TreeView
            items={treeViewItems}
            maxHeight={"25rem"}
            selectedItemId={targetFolder?.id.toString() ?? folders[0].id.toString()}
            handleSelectedItemChange={handleSelectedItemChange}
            defaultExpandedItems={[MYFORMS_FOLDER_ID.toString()]}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant={ComponentVariant.OUTLINED} onClick={handleClose}>
          {t("formulaire.cancel")}
        </Button>
        <Button variant={ComponentVariant.CONTAINED} onClick={handleMove}>
          {t("formulaire.move")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
