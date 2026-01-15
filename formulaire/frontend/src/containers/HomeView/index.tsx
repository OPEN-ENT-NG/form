import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "~/components/Header";
import { FORMULAIRE } from "~/core/constants";
import { ActionBar, Box } from "@cgi-learning-hub/ui";
import { useGetHomeHeaderButtons, useElementHeight } from "./utils";
import { FolderModal } from "../FolderModal";
import { FolderModalMode } from "../FolderModal/types";
import { HomeLayout } from "../HomeLayout";
import { ModalType } from "~/core/enums";
import { useGlobal } from "~/providers/GlobalProvider";
import { FormPropModal } from "../FormPropModal";
import { FormPropModalMode } from "../FormPropModal/enums";
import { useHome } from "~/providers/HomeProvider";
import { useMapActionBarButtons } from "./useMapActionBarButtons";
import { DeleteModal } from "../DeleteModal";
import { FormImportModal } from "../FormImportModal";
import { MoveModal } from "../MoveModal";
import { ExportModal } from "../ExportModal";
import { FormShareModal } from "../FormShareModal";
import { RemindModal } from "../RemindModal";
import { MyAnswersModal } from "../MyAnswersModal";
import { HomeTabState } from "~/providers/HomeProvider/enums";
import { WorkflowRights } from "~/core/rights";
import { FormOpenBlockedModal } from "../FormOpenBlockedModal";
import { homeViewStyle } from "./style";
import { defaultViewMaxWidth } from "~/core/constants";

export const HomeView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const headerButtons = useGetHomeHeaderButtons();
  const {
    displayModals: {
      showFolderCreate,
      showFolderRename,
      showMove,
      showDelete,
      showFormPropCreate,
      showFormPropUpdate,
      showFormOpenBlocked,
      showFormImport,
      showFormExport,
      showFormShare,
      showFormRemind,
      showFormAnswers,
    },
    toggleModal,
    isMobile,
  } = useGlobal();
  const { isActionBarOpen, tab, userWorkflowRights } = useHome();
  const { leftButtons, rightButtons, unselectAll } = useMapActionBarButtons();
  const [headerRef, headerHeight] = useElementHeight<HTMLDivElement>();

  const actionBarMobileSlotProps = {
    ...(isMobile && {
      root: { flexWrap: "wrap" as const },
      leftActionsContainer: { flexWrap: "wrap" as const },
      rightActionsContainer: { flexWrap: "wrap" as const, justifyContent: "flex-start" as const },
    }),
  };

  return (
    <Box sx={{ ...homeViewStyle, maxWidth: isMobile ? "inherit" : defaultViewMaxWidth }}>
      {!isMobile && (
        <Box ref={headerRef} sx={{ width: "100%" }}>
          <Header stringItems={[t("formulaire.title")]} buttons={tab === HomeTabState.FORMS ? headerButtons : []} />
        </Box>
      )}
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
      {showMove && (
        <MoveModal
          isOpen={showMove}
          handleClose={() => {
            toggleModal(ModalType.MOVE);
          }}
        />
      )}
      {showDelete && (
        <DeleteModal
          isOpen={showDelete}
          handleClose={() => {
            toggleModal(ModalType.DELETE);
          }}
        />
      )}
      {showFormPropCreate && (
        <FormPropModal
          isOpen={showFormPropCreate}
          handleClose={() => {
            toggleModal(ModalType.FORM_PROP_CREATE);
            unselectAll();
          }}
          mode={FormPropModalMode.CREATE}
          isRgpdPossible={userWorkflowRights[WorkflowRights.RGPD]}
        />
      )}
      {showFormPropUpdate && (
        <FormPropModal
          isOpen={showFormPropUpdate}
          handleClose={() => {
            toggleModal(ModalType.FORM_PROP_UPDATE);
            unselectAll();
          }}
          mode={FormPropModalMode.UPDATE}
          isRgpdPossible={userWorkflowRights[WorkflowRights.RGPD]}
        />
      )}
      {showFormOpenBlocked && (
        <FormOpenBlockedModal
          isOpen={showFormOpenBlocked}
          handleClose={() => {
            toggleModal(ModalType.FORM_OPEN_BLOCKED);
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
      {showFormExport && (
        <ExportModal
          isOpen={showFormExport}
          handleClose={() => {
            toggleModal(ModalType.FORM_EXPORT);
          }}
        />
      )}
      {showFormShare && (
        <FormShareModal
          isOpen={showFormShare}
          handleClose={() => {
            toggleModal(ModalType.FORM_SHARE);
          }}
        />
      )}
      {showFormRemind && (
        <RemindModal
          isOpen={showFormRemind}
          handleClose={() => {
            toggleModal(ModalType.FORM_REMIND);
          }}
        />
      )}
      {showFormAnswers && (
        <MyAnswersModal
          isOpen={showFormAnswers}
          handleClose={() => {
            toggleModal(ModalType.FORM_ANSWERS);
          }}
        />
      )}
      {isActionBarOpen && (
        <ActionBar leftActions={leftButtons} rightActions={rightButtons} slotProps={actionBarMobileSlotProps} />
      )}
    </Box>
  );
};
