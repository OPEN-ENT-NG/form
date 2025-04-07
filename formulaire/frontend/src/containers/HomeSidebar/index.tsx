import { FC, useCallback } from "react";
import { useHome } from "~/providers/HomeProvider";
import { buildFolderTree } from "./utils";
import { TreeView, Box, Button } from "@cgi-learning-hub/ui";
import { HomeTabs } from "~/components/HomeTab";
import { ModalType } from "~/core/enums";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, SHARED_FOLDER_ID, TRASH_FOLDER_ID } from "~/core/constants";
import { homeSidebarWrapper } from "./style";
import { useModal } from "~/providers/ModalProvider";

export const HomeSidebar: FC = () => {
  const { folders, currentFolder, setCurrentFolder, tab, toggleTab } = useHome();
  const { toggleModal } = useModal();

  const treeViewItems = buildFolderTree(folders);
  const { t } = useTranslation(FORMULAIRE);
  const isNotTrashOrShared = currentFolder.id !== SHARED_FOLDER_ID && currentFolder.id !== TRASH_FOLDER_ID;
  const handleSelectedItemChange = useCallback(
    (event: React.SyntheticEvent, itemId: string | null) => {
      if (!itemId) {
        setCurrentFolder(folders[0]);
        return;
      }
      const folderId = parseInt(itemId);

      if (!isNaN(folderId)) {
        const selectedFolder = folders.find((folder) => folder.id === folderId);
        if (selectedFolder) {
          setCurrentFolder(selectedFolder);
        }
      }
    },
    [folders, setCurrentFolder],
  );

  return (
    <Box sx={homeSidebarWrapper}>
      <Box height="3.5rem" display="flex" alignItems="center">
        <HomeTabs value={tab} setValue={toggleTab} />
      </Box>
      <TreeView
        items={treeViewItems}
        maxHeight={"75%"}
        selectedItemId={currentFolder.id.toString()}
        handleSelectedItemChange={handleSelectedItemChange}
      />
      {isNotTrashOrShared && (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            toggleModal(ModalType.showFolderCreate);
          }}
        >
          {t("formulaire.folder.create")}
        </Button>
      )}
    </Box>
  );
};
