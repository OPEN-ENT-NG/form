import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "~/components/Header";
import { FORMULAIRE } from "~/core/constants";
import { Box } from "@cgi-learning-hub/ui";
import { getHomeHeaderButtons, useElementHeight } from "./utils";
import { FolderModal } from "../FolderModal";
import { FOLDER_MODAL_MODE } from "../FolderModal/types";
import { HomeMainLayout } from "../HomeMainLayout";
import { useHomeProvider } from "~/providers/HomeProvider";
import { ModalType } from "~/core/enums";

export const HomeView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const headerButtons = getHomeHeaderButtons();
  const { displayModals, handleDisplayModal } = useHomeProvider();
  const [headerRef, headerHeight] = useElementHeight<HTMLDivElement>();

  return (
    <Box sx={{ height: "100%" }}>
      <Box ref={headerRef}>
        <Header stringItems={[t("formulaire.title")]} buttons={headerButtons} />
      </Box>
      <HomeMainLayout headerHeight={headerHeight} />
      {displayModals.FOLDER_CREATE === true && (
        <FolderModal
          isOpen={displayModals.FOLDER_CREATE === true}
          handleClose={() => handleDisplayModal(ModalType.FOLDER_CREATE)}
          mode={FOLDER_MODAL_MODE.CREATE}
        />
      )}
      {displayModals.FOLDER_RENAME === true && (
        <FolderModal
          isOpen={displayModals.FOLDER_RENAME === true}
          handleClose={() => handleDisplayModal(ModalType.FOLDER_RENAME)}
          mode={FOLDER_MODAL_MODE.RENAME}
        />
      )}
    </Box>
  );
};
