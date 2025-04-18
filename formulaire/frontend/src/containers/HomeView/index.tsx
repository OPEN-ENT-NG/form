import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "~/components/Header";
import { FORMULAIRE } from "~/core/constants";
import { Box } from "@cgi-learning-hub/ui";
import { useGetHomeHeaderButtons, useElementHeight } from "./utils";
import { FolderModal } from "../FolderModal";
import { FolderModalMode } from "../FolderModal/types";
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
import { FormShareModal } from "../FormShareModal";
import { RemindModal } from "../RemindModal";
import { MyAnswersModal } from "../MyAnswersModal";

export const HomeView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const headerButtons = useGetHomeHeaderButtons();
  const {
    displayModals: {
      showFolderCreate,
      showFolderRename,
      showFormPropCreate,
      showFormPropUpdate,
      showFormFolderDelete,
      showFormImport,
      showMove,
      showExport,
      showShare,
      showRemind,
      showAnswers,
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
      {showFolderCreate && (
        <FolderModal
          isOpen={showFolderCreate}
          handleClose={() => {
            toggleModal(ModalType.FOLDER_CREATE);
          }}
          mode={FolderModalMode.CREATE}
        />
      )}
      {showFolderRename && (
        <FolderModal
          isOpen={showFolderRename}
          handleClose={() => {
            toggleModal(ModalType.FOLDER_RENAME);
          }}
          mode={FolderModalMode.RENAME}
        />
      )}
      {showFormFolderDelete && (
        <DeleteModal
          isOpen={showFormFolderDelete}
          handleClose={() => {
            toggleModal(ModalType.FORM_FOLDER_DELETE);
          }}
        />
      )}
      {showFormPropCreate && (
        <FormPropModal
          isOpen={showFormPropCreate}
          handleClose={() => {
            toggleModal(ModalType.FORM_PROP_CREATE);
          }}
          mode={FormPropModalMode.CREATE}
          isRgpdPossible
        />
      )}
      {showFormPropUpdate && (
        <FormPropModal
          isOpen={showFormPropUpdate}
          handleClose={() => {
            toggleModal(ModalType.FORM_PROP_UPDATE);
          }}
          mode={FormPropModalMode.UPDATE}
          isRgpdPossible
        />
      )}
      {showMove && (
        <MoveFolderModal
          isOpen={showMove}
          handleClose={() => {
            toggleModal(ModalType.MOVE);
          }}
        />
      )}
      {showFormImport && (
        <FormImportModal
          isOpen={showFormImport}
          handleClose={() => {
            toggleModal(ModalType.FORM_IMPORT);
          }}
        />
      )}
      {showExport && (
        <ExportModal
          isOpen={showExport}
          handleClose={() => {
            toggleModal(ModalType.EXPORT);
          }}
        />
      )}
      {showShare && (
        <FormShareModal
          isOpen={showShare}
          handleClose={() => {
            toggleModal(ModalType.FORM_SHARE);
          }}
        />
      )}
      {showRemind && (
        <RemindModal
          isOpen={showRemind}
          handleClose={() => {
            toggleModal(ModalType.REMIND);
          }}
        />
      )}
      {showAnswers && (
        <MyAnswersModal
          isOpen={showAnswers}
          handleClose={() => {
            toggleModal(ModalType.ANSWERS);
          }}
        />
      )}
      {isToasterOpen && <Toaster leftButtons={leftButtons} rightButtons={rightButtons} />}
    </Box>
  );
};
