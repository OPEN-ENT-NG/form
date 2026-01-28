import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@cgi-learning-hub/ui";
import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { OrganizationSortableItem } from "~/components/OrganizationSortableItem";
import { OrganizationSortableItemPreview } from "~/components/OrganizationSortableItemPreview";
import { DRAG_HORIZONTAL_TRESHOLD, FORMULAIRE } from "~/core/constants";
import { flattenFormElements } from "~/core/models/formElement/utils";
import { BreakpointVariant, ComponentVariant } from "~/core/style/themeProps";
import { IModalProps } from "~/core/types";
import { updateNextTargetElements } from "~/hook/dnd-hooks/useCreationDnd/utils";
import { useOrganizationModalDnd } from "~/hook/dnd-hooks/useOrganizationModalDnd";
import { useCreation } from "~/providers/CreationProvider";
import { checkForDoubleConditionnalInSections } from "~/providers/CreationProvider/utils";

import { contentStackStyle } from "./style";
import { IFlattenedItem } from "./types";
import { formElementsListToFlattenedItemList } from "./utils";

export const CreationOrganisationModal: FC<IModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { formElementsList, setFormElementsList, updateFormElementsList, setResetFormElementListId } = useCreation();

  const [flattenedFormElementsList, setFlattenedFormElementsList] = useState<IFlattenedItem[]>(() =>
    formElementsListToFlattenedItemList(formElementsList),
  );

  const sortedIds = useMemo(() => flattenedFormElementsList.map(({ id }) => id), [flattenedFormElementsList]);

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

  const handleConfirm = useCallback(() => {
    if (checkForDoubleConditionnalInSections(formElementsList)) return;
    const updatedFormElementsList = updateNextTargetElements(formElementsList);
    void updateFormElementsList(flattenFormElements(updatedFormElementsList));
    handleClose();
  }, [updateNextTargetElements, updateFormElementsList, formElementsList, handleClose]);

  const handleResetAndClose = useCallback(() => {
    setResetFormElementListId((prev) => prev + 1);
    handleClose();
  }, [setResetFormElementListId, handleClose]);

  const renderItems = useCallback(
    (): ReactNode =>
      flattenedFormElementsList.map(({ id, element, depth }) => {
        return <OrganizationSortableItem key={id} element={element} depth={depth} />;
      }),
    [flattenedFormElementsList],
  );

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
