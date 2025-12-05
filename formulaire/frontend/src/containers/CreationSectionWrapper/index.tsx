import { Box } from "@cgi-learning-hub/ui";
import { CreationSection } from "~/components/CreationSection";
import { ICreationSectionWrapperProps } from "./types";
import { FC } from "react";
import { CreationEditingSection } from "~/components/CreationEditingSection";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";
import { useGlobal } from "~/providers/GlobalProvider";
import { ClickAwayDataType, ModalType } from "~/core/enums";
import { CreateFormElementModal } from "../CreateFormElementModal";
import { useClickAwayEditingElement } from "~/providers/CreationProvider/hook/useClickAwayEditingElement";

export const CreationSectionWrapper: FC<ICreationSectionWrapperProps> = ({ section }) => {
  const {
    currentEditingElement,
    questionModalSection,
    handleDeleteFormElement,
    setCurrentEditingElement,
    saveSection,
    formElementsList,
    setFormElementsList,
  } = useCreation();
  const isEditing = isCurrentEditingElement(section, currentEditingElement);
  const {
    displayModals: { showQuestionCreate },
    toggleModal,
  } = useGlobal();
  const { handleClickAway } = useClickAwayEditingElement(
    handleDeleteFormElement,
    setCurrentEditingElement,
    formElementsList,
    setFormElementsList,
    undefined,
    saveSection,
  );

  return (
    <Box
      data-type={ClickAwayDataType.SECTION}
      onClick={(e) => {
        handleClickAway(e, currentEditingElement, section);
      }}
    >
      {isEditing ? <CreationEditingSection section={section} /> : <CreationSection section={section} />}
      {showQuestionCreate && questionModalSection?.id === section.id && (
        <CreateFormElementModal
          isOpen={showQuestionCreate}
          handleClose={() => {
            toggleModal(ModalType.QUESTION_CREATE);
          }}
          showSection={false}
          parentSection={section}
        />
      )}
    </Box>
  );
};
