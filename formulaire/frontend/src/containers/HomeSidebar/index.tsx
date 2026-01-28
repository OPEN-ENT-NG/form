import { Box, Button, TreeView } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { HomeTabs } from "~/components/HomeTab";
import { FORMULAIRE, SHARED_FOLDER_ID, TRASH_FOLDER_ID } from "~/core/constants";
import { ModalType } from "~/core/enums";
import { useGlobal } from "~/providers/GlobalProvider";
import { useHome } from "~/providers/HomeProvider";

import { homeSidebarWrapper } from "./style";
import { buildFolderTree } from "./utils";

export const HomeSidebar: FC = () => {
  const { folders, currentFolder, tab, toggleTab, handleSelectedItemChange } = useHome();
  const { toggleModal } = useGlobal();

  const treeViewItems = buildFolderTree(folders);
  const { t } = useTranslation(FORMULAIRE);
  const isNotTrashOrShared = currentFolder.id !== SHARED_FOLDER_ID && currentFolder.id !== TRASH_FOLDER_ID;

  return (
    <Box sx={homeSidebarWrapper}>
      <Box height="3.5rem" display="flex" alignItems="center" justifyContent="center">
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
            toggleModal(ModalType.FOLDER_CREATE);
          }}
        >
          {t("formulaire.folder.create")}
        </Button>
      )}
    </Box>
  );
};
