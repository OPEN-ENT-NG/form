import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "~/components/Header";
import { FORMULAIRE } from "~/core/constants";
import { Box } from "@cgi-learning-hub/ui";
import { getHomeHeaderButtons, useElementHeight } from "./utils";
import { FolderModal } from "../FolderModal";
import { FOLDER_MODAL_MODE } from "../FolderModal/types";
import { HomeMainLayout } from "../HomeMainLayout";
import { useHome } from "~/providers/HomeProvider";
import { ModalType } from "~/core/enums";

export const HomeView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const headerButtons = getHomeHeaderButtons();
  const { displayModals, handleDisplayModal } = useHome();
  const [headerRef, headerHeight] = useElementHeight<HTMLDivElement>();

  return (
    <Box height={"100%"}>
      <Box ref={headerRef}>
        <Header stringItems={[t("formulaire.title")]} buttons={headerButtons} />
      </Box>
      <HomeMainLayout headerHeight={headerHeight} />
      {displayModals.FOLDER_CREATE && (
        <FolderModal
          isOpen={displayModals.FOLDER_CREATE}
          handleClose={() => handleDisplayModal(ModalType.FOLDER_CREATE)}
          mode={FOLDER_MODAL_MODE.CREATE}
        />
      )}
      {displayModals.FOLDER_RENAME && (
        <FolderModal
          isOpen={displayModals.FOLDER_RENAME}
          handleClose={() => handleDisplayModal(ModalType.FOLDER_RENAME)}
          mode={FOLDER_MODAL_MODE.RENAME}
        />
      )}
    </Box>
  );
};
