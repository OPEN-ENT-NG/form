import { DragMoveEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { IFormElement } from "~/core/models/formElement/types";
import { flattenFormElements } from "~/core/models/formElement/utils";
import { IQuestion } from "~/core/models/question/types";
import { DndElementType, DndMove } from "./enum";
import { getDndMove, moveQRtoQS, moveQStoQR, moveQStoQS, moveRtoR } from "./mainUtils";
import {
  getElementById,
  getElementId,
  getOverDndElementType,
  getOverSection,
  getSectionById,
  getTargetQuestionPositionInSection,
  getTargetRootPosition,
  updateNextTargetElements,
} from "./utils";
import { checkForDoubleConditionnalInSections } from "~/providers/CreationProvider/utils";

export const useCreationDnd = (
  formElementsList: IFormElement[],
  setFormElementsList: Dispatch<SetStateAction<IFormElement[]>>,
  updateFormElementsList: (formElementsList: IFormElement[]) => Promise<void>,
  setIsDragging: Dispatch<SetStateAction<boolean>>,
  setResetFormElementListId: Dispatch<SetStateAction<number>>,
) => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const [isOverEnabled, setIsOverEnable] = useState<boolean>(true);
  const pauseYRef = useRef<number | null>(null);

  const initialListRef = useRef<IFormElement[] | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setIsDragging(true);
    const activeElementId = getElementId(active);
    if (!activeElementId) return;
    setActiveId(activeElementId);
    pauseYRef.current = null;
    initialListRef.current = formElementsList;
  };

  const handleDragMove = ({ delta }: DragMoveEvent) => {
    if (!activeId) return;

    if (!isOverEnabled) {
      if (pauseYRef.current === null) pauseYRef.current = delta.y;
      else {
        const dy = Math.abs(delta.y - pauseYRef.current);
        if (dy > 10) {
          setIsOverEnable(true);
          pauseYRef.current = null;
        }
      }
    }
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    if (!isOverEnabled) return;
    const overElementId = getElementId(over);
    if (!activeId || !overElementId || activeId === overElementId) return;
    const activeElement = getElementById(formElementsList, activeId);
    if (!activeElement) return;
    const overElement = getElementById(formElementsList, overElementId);
    if (!overElement) return;

    const overDndElementType: DndElementType | null = getOverDndElementType(over);
    if (!overDndElementType) return;

    const dndMove = getDndMove(activeElement, overDndElementType, overElement);
    switch (dndMove) {
      case DndMove.R_TO_R:
        setFormElementsList((prevList) => moveRtoR(prevList, activeElement, overElement));
        break;
      case DndMove.QS_TO_QS:
        {
          const overSection = getOverSection(overElement, overDndElementType, formElementsList);
          const targetSectionPos = getTargetQuestionPositionInSection(overSection, overElement, overDndElementType);
          setFormElementsList((prevList) =>
            moveQStoQS(prevList, activeElement as IQuestion, overSection, targetSectionPos),
          );
        }
        break;
      case DndMove.QR_TO_QS: {
        const overSection = getOverSection(overElement, overDndElementType, formElementsList);
        const targetSectionPos = getTargetQuestionPositionInSection(overSection, overElement, overDndElementType);
        setFormElementsList((prevList) =>
          moveQRtoQS(prevList, activeElement as IQuestion, overSection, targetSectionPos),
        );
        break;
      }
      case DndMove.QS_TO_QR: {
        const activeSection = getSectionById(formElementsList, (activeElement as IQuestion).sectionId);
        if (!activeSection) return;
        const targetRootPos = getTargetRootPosition(activeSection, overElement, overDndElementType);
        if (!targetRootPos) return;
        setFormElementsList((prevList) =>
          moveQStoQR(prevList, activeElement as IQuestion, activeSection, targetRootPos),
        );
        break;
      }
    }

    setIsOverEnable(false);
  };

  const handleDragEnd = () => {
    if (!initialListRef.current) return;
    const initialStr = JSON.stringify(initialListRef.current);
    const finalStr = JSON.stringify(formElementsList);
    if (initialStr !== finalStr) {
      if (checkForDoubleConditionnalInSections(formElementsList)) {
        setResetFormElementListId((prev) => prev + 1);
        return;
      }
      const updatedFormElementsList = updateNextTargetElements(formElementsList);
      void updateFormElementsList(flattenFormElements(updatedFormElementsList));
    }
    initialListRef.current = null;
    setIsDragging(false);
  };

  return {
    activeId,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragMove,
  };
};
