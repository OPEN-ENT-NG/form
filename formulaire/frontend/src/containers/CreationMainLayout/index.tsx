import { Box, Button } from "@cgi-learning-hub/ui";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CreationSortableItem } from "~/components/CreationSortableItem";
import { FORMULAIRE } from "~/core/constants";
import { ModalType } from "~/core/enums";
import { hasFormResponses } from "~/core/models/form/utils";
import { ComponentVariant } from "~/core/style/themeProps";
import { useCreationDnd } from "~/hook/dnd-hooks/useCreationDnd";
import { useCreation } from "~/providers/CreationProvider";
import { useGlobal } from "~/providers/GlobalProvider";
import { actionButtonStyle, elementListStyle, innerContainerStyle, outerContainerStyle } from "./style";

export const CreationMainLayout: FC = () => {
  const { form, formElementsList, setFormElementsList } = useCreation();
  const { t } = useTranslation(FORMULAIRE);
  const { toggleModal } = useGlobal();

  const sortedIds = useMemo(
    () => formElementsList.map((formElement) => formElement.id).filter((id): id is number => id != null),
    [formElementsList],
  );

  const handleNewFormElement = () => {
    toggleModal(ModalType.FORM_ELEMENT_CREATE);
  };

  // Use our custom hook to manage drag state & handlers
  const { activeId, handleDragStart, handleDragOver, handleDragEnd, sensors } = useCreationDnd(
    formElementsList,
    setFormElementsList,
  );

  const activeItem = formElementsList.find((item) => item.id === activeId) || null;

  return (
    <Box sx={outerContainerStyle}>
      <Box sx={innerContainerStyle}>
        <Box sx={elementListStyle}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
              {formElementsList.map((formElement) => (
                <CreationSortableItem key={formElement.id} formElement={formElement} />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeItem != null && <CreationSortableItem key={activeItem.id} formElement={activeItem} isPreview />}
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
