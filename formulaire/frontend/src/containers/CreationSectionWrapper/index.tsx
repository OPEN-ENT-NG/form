import { Box } from "@cgi-learning-hub/ui";
import { useSortable } from "@dnd-kit/sortable";
import { FC, useMemo } from "react";
import { CreationEditingSection } from "~/components/CreationEditingSection";
import { CreationSection } from "~/components/CreationSection";
import { getTransformStyle } from "~/components/CreationSortableItem/utils";
import { ClickAwayDataType, ModalType } from "~/core/enums";
import { DndElementType } from "~/hook/dnd-hooks/useCreationDnd/enum";
import { useCreation } from "~/providers/CreationProvider";
import { useClickAwayEditingElement } from "~/providers/CreationProvider/hook/useClickAwayEditingElement";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useGlobal } from "~/providers/GlobalProvider";
import { CreateFormElementModal } from "../CreateFormElementModal";
import { ICreationSectionWrapperProps } from "./types";

export const CreationSectionWrapper: FC<ICreationSectionWrapperProps> = ({ section, isPreview }) => {
  const {
    currentEditingElement,
    questionModalSection,
    handleDeleteFormElement,
    setCurrentEditingElement,
    saveSection,
    saveQuestion,
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
    saveQuestion,
    saveSection,
  );

  const { setNodeRef, transform, transition, listeners, attributes } = useSortable({
    id: `${DndElementType.SECTION}-${section.id}`,
    data: { element: section, dndElementType: DndElementType.SECTION },
  });

  const style = useMemo(() => getTransformStyle(transform, transition), [transform, transition]);

  return (
    <Box
      style={style}
      ref={setNodeRef}
      data-type={ClickAwayDataType.SECTION}
      onMouseDown={(e) => {
        handleClickAway(e, currentEditingElement, section);
      }}
    >
      {isEditing ? (
        <CreationEditingSection section={section} />
      ) : (
        <CreationSection listeners={listeners} attributes={attributes} section={section} isPreview={isPreview} />
      )}
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
