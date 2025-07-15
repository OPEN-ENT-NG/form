import { Box } from "@cgi-learning-hub/ui";
import { CreationSection } from "~/components/CreationSection";
import { ICreationSectionWrapperProps } from "./types";
import { FC } from "react";
import { CreationEditingSection } from "~/components/CreationEditingSection";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";
import { useModal } from "~/providers/ModalProvider";
import { ModalType } from "~/core/enums";
import { CreateFormElementModal } from "../CreateFormElementModal";

export const CreationSectionWrapper: FC<ICreationSectionWrapperProps> = ({ section }) => {
  const { currentEditingElement, questionModalSection } = useCreation();
  const isEditing = isCurrentEditingElement(section, currentEditingElement);
  const {
    displayModals: { showQuestionCreate },
    toggleModal,
  } = useModal();

  return (
    <Box>
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
