import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "~/components/Header";
import { FORMULAIRE } from "~/core/constants";
import { Box } from "@cgi-learning-hub/ui";
import { useGetHomeHeaderButtons, useElementHeight } from "./utils";
import { FolderModal } from "../FolderModal";
import { FOLDER_MODAL_MODE } from "../FolderModal/enum";
import { HomeLayout } from "../HomeLayout";
import { ModalType } from "~/core/enums";
import { useModal } from "~/providers/ModalProvider";
import { FormPropModal } from "../FormPropModal";
import { FormPropModalMode } from "../FormPropModal/enums";
import { useHome } from "~/providers/HomeProvider";
import { Toaster } from "~/components/Toaster";
import { useMapToasterButtons } from "./useMapToasterButtons";
import { DeleteModal } from "../DeleteModal";
import { FormImportModal } from "../FormImportModal";
import { MoveFolderModal } from "../MoveFolderModal";
import { ExportModal } from "../ExportModal";

export const HomeView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const headerButtons = useGetHomeHeaderButtons();
  const {
    displayModals: {
      FOLDER_CREATE,
      FOLDER_RENAME,
      FORM_PROP_CREATE,
      FORM_PROP_UPDATE,
      FORM_FOLDER_DELETE,
      FORM_IMPORT,
      MOVE,
      EXPORT,
    },
    toggleModal,
  } = useModal();
  const { isToasterOpen } = useHome();
  const { leftButtons, rightButtons } = useMapToasterButtons();
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
      {FORM_FOLDER_DELETE && (
        <DeleteModal isOpen={FORM_FOLDER_DELETE} handleClose={() => toggleModal(ModalType.FORM_FOLDER_DELETE)} />
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
      {MOVE && <MoveFolderModal isOpen={MOVE} handleClose={() => toggleModal(ModalType.MOVE)} />}
      {FORM_IMPORT && <FormImportModal isOpen={FORM_IMPORT} handleClose={() => toggleModal(ModalType.FORM_IMPORT)} />}
      {EXPORT && <ExportModal isOpen={EXPORT} handleClose={() => toggleModal(ModalType.EXPORT)} />}
      {isToasterOpen && <Toaster leftButtons={leftButtons} rightButtons={rightButtons} />}
    </Box>
  );
};
