import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Stack } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { DRAG_HORIZONTAL_TRESHOLD, FORMULAIRE } from "~/core/constants";
import { BreakpointVariant, ComponentVariant } from "~/core/style/themeProps";
import { IModalProps } from "~/core/types";
import { useCreation } from "~/providers/CreationProvider";
import { OrganizationSortableItem } from "~/components/OrganizationSortableItem";
import { contentStackStyle } from "./style";
import { rectIntersection, DndContext, DragOverlay } from "@dnd-kit/core";
import { verticalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { formElementsListToFlattenedItemList } from "./utils";
import { IFlattenedItem } from "./types";
import { useOrganizationModalDnd } from "~/hook/dnd-hooks/useOrganizationModalDnd";
import { OrganizationSortableItemPreview } from "~/components/OrganizationSortableItemPreview";
import { flattenFormElements } from "~/core/models/formElement/utils";

export const CreationOrganisationModal: FC<IModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { formElementsList, setFormElementsList, updateFormElementsList, setResetFormElementListId } = useCreation();

  const [flattenedFormElementsList, setFlattenedFormElementsList] = useState<IFlattenedItem[]>(() =>
    formElementsListToFlattenedItemList(formElementsList),
  );
  const sortedIds = useMemo(
    () => flattenedFormElementsList.map(({ id }) => id),
    [flattenedFormElementsList, formElementsList],
  );

  useEffect(() => {
    setFlattenedFormElementsList(formElementsListToFlattenedItemList(formElementsList));
  }, [formElementsList]);

  // Use our custom hook to manage drag state & handlers
  const {
    activeId,
    activeItems,
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    sensors,
  } = useOrganizationModalDnd(
    flattenedFormElementsList,
    setFlattenedFormElementsList,
    setFormElementsList,
    DRAG_HORIZONTAL_TRESHOLD,
  );

  const handleConfirm = () => {
    void updateFormElementsList(flattenFormElements(formElementsList));
    handleClose();
  };

  const handleResetAndClose = () => {
    setResetFormElementListId((prev) => prev + 1);
    handleClose();
  };

  const renderItems = (): ReactNode =>
    flattenedFormElementsList.map(({ id, element, depth }) => {
      return <OrganizationSortableItem key={id} element={element} depth={depth} />;
    });

  return (
    <Dialog open={isOpen} onClose={handleResetAndClose} maxWidth={BreakpointVariant.MD} fullWidth>
      <DialogTitle>{t("formulaire.organize")}</DialogTitle>
      <DialogContent>
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
            <Stack sx={contentStackStyle}>{renderItems()}</Stack>
          </SortableContext>

          <DragOverlay>
            {activeId != null &&
              activeItems.map(({ id, element, depth }) => (
                <OrganizationSortableItemPreview key={id} formElement={element} depth={depth} />
              ))}
          </DragOverlay>
        </DndContext>
      </DialogContent>
      <DialogActions>
        <Button variant={ComponentVariant.OUTLINED} onClick={handleResetAndClose}>
          {t("formulaire.cancel")}
        </Button>
        <Button variant={ComponentVariant.CONTAINED} onClick={handleConfirm}>
          {t("formulaire.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
