import { FC } from "react";

import { Box } from "@cgi-learning-hub/ui";
import { Header } from "~/components/Header";
import { useElementHeight } from "../HomeView/utils";
import { useCreation } from "~/providers/CreationProvider";
import { getRecursiveFolderParents, useGetCreationHeaderButtons } from "./utils";
import { CreationLayout } from "../CreationLayout";
import { useModal } from "~/providers/ModalProvider";
import { ModalType } from "~/core/enums";
import { CreateFormElementModal } from "../CreateFormElementModal";
import { IForm } from "~/core/models/form/types";
import { CreationOrganisationModal } from "../CreationOrganisationModal";

export const CreationView: FC = () => {
  const { form, folders, formElementsList } = useCreation();
  const [headerRef, headerHeight] = useElementHeight<HTMLDivElement>();
  const headerButtons = useGetCreationHeaderButtons(form?.id, formElementsList);

  const {
    displayModals: { showFormElementCreate, showOrganization },
    toggleModal,
  } = useModal();

  const getStringFolders = (form: IForm): string[] => {
    const parentFolders = getRecursiveFolderParents(form.folder_id, folders);
    return [...parentFolders.map((folder) => folder.name), form.title];
  };

  return (
    <Box height="100%">
      <Box ref={headerRef}>
        {form && (
          <Header
            stringItems={getStringFolders(form)}
            buttons={headerButtons}
            form={form}
            isCreationPage
            displaySeparator
          />
        )}
      </Box>
      {form && <CreationLayout headerHeight={headerHeight} />}
      {showFormElementCreate && (
        <CreateFormElementModal
          isOpen={showFormElementCreate}
          handleClose={() => {
            toggleModal(ModalType.FORM_ELEMENT_CREATE);
          }}
        />
      )}
      {showOrganization && (
        <CreationOrganisationModal
          isOpen={showOrganization}
          handleClose={() => {
            toggleModal(ModalType.ORGANIZATION);
          }}
        />
      )}
    </Box>
  );
};
