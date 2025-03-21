import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "~/components/Header";
import { FORMULAIRE } from "~/core/constants";
import { Box } from "@cgi-learning-hub/ui";
import { useGetHomeHeaderButtons, useElementHeight } from "./utils";
import { FolderModal } from "../FolderModal";
import { FOLDER_MODAL_MODE } from "../FolderModal/types";
import { HomeLayout } from "../HomeLayout";
import { ModalType } from "~/core/enums";
import { useModal } from "~/providers/ModalProvider";
import { FormPropModal } from "../FormPropModal";
import { FormPropModalMode } from "../FormPropModal/enums";

export const HomeView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const headerButtons = useGetHomeHeaderButtons();
  const {
    displayModals: { FOLDER_CREATE, FOLDER_RENAME, FORM_PROP_CREATE, FORM_PROP_UPDATE },
    toggleModal,
  } = useModal();
  const [headerRef, headerHeight] = useElementHeight<HTMLDivElement>();

  return (
    <Box height={"100%"}>
      <Box ref={headerRef}>
        <Header stringItems={[t("formulaire.title")]} buttons={headerButtons} />
      </Box>
      <HomeLayout headerHeight={headerHeight} />
      {FOLDER_CREATE && (
        <FolderModal
          isOpen={FOLDER_CREATE}
          handleClose={() => toggleModal(ModalType.FOLDER_CREATE)}
          mode={FOLDER_MODAL_MODE.CREATE}
        />
      )}
      {FOLDER_RENAME && (
        <FolderModal
          isOpen={FOLDER_RENAME}
          handleClose={() => toggleModal(ModalType.FOLDER_RENAME)}
          mode={FOLDER_MODAL_MODE.RENAME}
        />
      )}
      {FORM_PROP_CREATE && (
        <FormPropModal
          isOpen={FORM_PROP_CREATE}
          handleClose={() => toggleModal(ModalType.FORM_PROP_CREATE)}
          mode={FormPropModalMode.CREATE}
          isRgpdPossible
        />
      )}
      {FORM_PROP_UPDATE && (
        <FormPropModal
          isOpen={FORM_PROP_UPDATE}
          handleClose={() => toggleModal(ModalType.FORM_PROP_UPDATE)}
          mode={FormPropModalMode.UPDATE}
          isRgpdPossible
        />
      )}
    </Box>
  );
};
