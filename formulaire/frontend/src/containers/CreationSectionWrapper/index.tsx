import { Box } from "@cgi-learning-hub/ui";
import { useSortable } from "@dnd-kit/sortable";
import { FC, useMemo } from "react";
import { CreationEditingSection } from "~/components/CreationEditingSection";
import { CreationSection } from "~/components/CreationSection";
import { getTransformStyle } from "~/components/CreationSortableItem/utils";
import { ModalType } from "~/core/enums";
import { DndElementType } from "~/hook/dnd-hooks/useCreationDnd/enum";
import { useCreation } from "~/providers/CreationProvider";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useGlobal } from "~/providers/GlobalProvider";
import { CreateFormElementModal } from "../CreateFormElementModal";
import { ICreationSectionWrapperProps } from "./types";

export const CreationSectionWrapper: FC<ICreationSectionWrapperProps> = ({ section }) => {
  const { currentEditingElement, questionModalSection } = useCreation();
  const isEditing = isCurrentEditingElement(section, currentEditingElement);
  const {
    displayModals: { showQuestionCreate },
    toggleModal,
  } = useGlobal();

  const { setNodeRef, transform, transition } = useSortable({
    id: section.id ?? 0,
    data: { element: section, dndElementType: DndElementType.SECTION },
  });

  const style = useMemo(() => getTransformStyle(transform, transition), [transform, transition]);

  return (
    <Box style={style} ref={setNodeRef}>
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
