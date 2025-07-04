import { FC, ReactNode, useMemo } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Stack } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant } from "~/core/style/themeProps";
import { IModalProps } from "~/core/types";
import { useCreation } from "~/providers/CreationProvider";
import { OrganizationSortableItem, OrganizationSortableItemDisplay } from "~/components/OrganizationSortableItem";
import { contentStackStyle } from "./style";
import { closestCenter, DndContext, DragOverlay, MeasuringStrategy } from "@dnd-kit/core";
import { verticalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { flattenFormElements } from "./utils";
import { IFlattenedItem } from "./types";
import { useOrganizationModalDnd } from "~/hook/dnd-hooks/useOrganizationModalDnd";

export const CreationOrganisationModal: FC<IModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { formElementsList, setFormElementsList } = useCreation();

  const flattenedItems = useMemo<IFlattenedItem[]>(() => flattenFormElements(formElementsList), [formElementsList]);
  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);

  // Use our custom hook to manage drag state & handlers
  const {
    activeId,
    projected,
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    sensors,
  } = useOrganizationModalDnd(flattenedItems, setFormElementsList, 40);

  const handleConfirm = () => {
    console.log("Confirming organization changes");
    // void updateFormElementsList(flattenFormElements(formElementsList));
    handleClose();
  };

  const renderItems = (): ReactNode =>
    flattenedItems.map(({ id, element, depth }) => {
      const effectiveDepth = id === activeId && projected ? projected.depth : depth;
      return <OrganizationSortableItem key={id} element={element} indent={effectiveDepth * 4} />;
    });

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle>{t("formulaire.organize")}</DialogTitle>
      <DialogContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
            <Stack sx={contentStackStyle}>{renderItems()}</Stack>
          </SortableContext>

          <DragOverlay>{activeId != null && <OrganizationSortableItemDisplay activeId={activeId} />}</DragOverlay>
        </DndContext>
      </DialogContent>
      <DialogActions>
        <Button variant={ComponentVariant.OUTLINED} onClick={handleClose}>
          {t("formulaire.cancel")}
        </Button>
        <Button variant={ComponentVariant.CONTAINED} onClick={handleConfirm}>
          {t("formulaire.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
