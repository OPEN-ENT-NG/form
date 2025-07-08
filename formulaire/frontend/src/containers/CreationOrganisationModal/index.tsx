import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Stack } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant } from "~/core/style/themeProps";
import { IModalProps } from "~/core/types";
import { useCreation } from "~/providers/CreationProvider";
import { OrganizationSortableItem, OrganizationSortableItemDisplay } from "~/components/OrganizationSortableItem";
import { contentStackStyle } from "./style";
import { closestCenter, closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import { verticalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { flattenFormElements } from "./utils";
import { IFlattenedItem } from "./types";
import { useOrganizationModalDnd } from "~/hook/dnd-hooks/useOrganizationModalDnd";

export const CreationOrganisationModal: FC<IModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { formElementsList, setFormElementsList } = useCreation();

  const [localFlat, setLocalFlat] = useState<IFlattenedItem[]>(() => flattenFormElements(formElementsList));
  const sortedIds = useMemo(() => localFlat.map(({ id }) => id), [localFlat, formElementsList]);

  useEffect(() => {
    setLocalFlat(flattenFormElements(formElementsList));
  }, [formElementsList]);

  useEffect(() => {
    console.log("Local flat updated:", localFlat, sortedIds);
  }, [localFlat, sortedIds]);


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
  } = useOrganizationModalDnd(localFlat, setLocalFlat, setFormElementsList, 40);

  const handleConfirm = () => {
    console.log("Confirming organization changes");
    // void updateFormElementsList(flattenFormElements(formElementsList));
    handleClose();
  };

  const renderItems = (): ReactNode =>
    localFlat.map(({ id, element, depth }) => {
      return <OrganizationSortableItem key={id} element={element} indent={depth * 4} />;
    });

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle>{t("formulaire.organize")}</DialogTitle>
      <DialogContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
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
              activeItems.map(({ id, depth }) => (
                <OrganizationSortableItemDisplay key={id} activeId={id} indent={depth * 4} />
              ))}
          </DragOverlay>
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
