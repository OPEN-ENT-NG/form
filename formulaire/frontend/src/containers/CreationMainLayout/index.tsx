import { Box, Button } from "@cgi-learning-hub/ui";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CreationSortableItem } from "~/components/CreationSortableItem";
import { FORMULAIRE } from "~/core/constants";
import { ModalType } from "~/core/enums";
import { ComponentVariant } from "~/core/style/themeProps";
import { useCreationDnd } from "~/hook/dnd-hooks/useCreationDnd";
import { getDndElementType, getElementById } from "~/hook/dnd-hooks/useCreationDnd/utils";
import { useCreation } from "~/providers/CreationProvider";
import { useGlobal } from "~/providers/GlobalProvider";
import { actionButtonStyle, elementListStyle, innerContainerStyle, outerContainerStyle } from "./style";
import { hasFormResponses } from "~/core/models/form/utils";

export const CreationMainLayout: FC = () => {
  const {
    form,
    formElementsList,
    setFormElementsList,
    updateFormElementsList,
    setIsDragging,
    setResetFormElementListId,
  } = useCreation();
  const { t } = useTranslation(FORMULAIRE);
  const { toggleModal } = useGlobal();

  const sortedIds = useMemo(
    () => formElementsList.map((formElement) => `${getDndElementType(formElement)}-${formElement.id}`),
    [formElementsList],
  );

  const handleNewFormElement = () => {
    toggleModal(ModalType.FORM_ELEMENT_CREATE);
  };

  // Use our custom hook to manage drag state & handlers
  const { activeId, handleDragStart, handleDragOver, handleDragEnd, handleDragMove, sensors } = useCreationDnd(
    formElementsList,
    setFormElementsList,
    updateFormElementsList,
    setIsDragging,
    setResetFormElementListId,
  );

  const activeItem = getElementById(formElementsList, activeId);

  return (
    <Box sx={outerContainerStyle}>
      <Box sx={innerContainerStyle}>
        <Box sx={elementListStyle}>
          <DndContext
            sensors={sensors}
            autoScroll={{ acceleration: 200 }}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
          >
            <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
              {formElementsList.map((formElement) => (
                <CreationSortableItem key={formElement.id} formElement={formElement} />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeItem != null && <CreationSortableItem formElement={activeItem} isPreview />}
            </DragOverlay>
          </DndContext>
        </Box>
        <Box sx={actionButtonStyle}>
          <Button
            variant={ComponentVariant.CONTAINED}
            onClick={handleNewFormElement}
            disabled={!!form && hasFormResponses(form)}
          >
            {t("formulaire.add.element")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
