import { FC } from "react";

import { Box } from "@cgi-learning-hub/ui";
import { Header } from "~/components/Header";
import { useElementHeight } from "../HomeView/utils";
import { useCreation } from "~/providers/CreationProvider";
import { useGetCreationHeaderButtons } from "./utils";
import { CreationLayout } from "../CreationLayout";
import { FORMULAIRE } from "~/core/constants";
import { useTranslation } from "react-i18next";
import { useModal } from "~/providers/ModalProvider";
import { ModalType } from "~/core/enums";
import { CreateFormElementModal } from "../CreateFormElementModal";

export const CreationView: FC = () => {
  const { form } = useCreation();
  const [headerRef, headerHeight] = useElementHeight<HTMLDivElement>();
  const headerButtons = useGetCreationHeaderButtons();
  const { t } = useTranslation(FORMULAIRE);

  const {
    displayModals: { showFormElementCreate },
    toggleModal,
  } = useModal();

  return (
    <Box height="100%">
      <Box ref={headerRef}>
        {form ? (
          <Header stringItems={[form.title]} buttons={headerButtons} displaySeparator />
        ) : (
          <Header stringItems={[t("formulaire.title")]} buttons={headerButtons} displaySeparator />
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
    </Box>
  );
};
