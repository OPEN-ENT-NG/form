import { SelectChangeEvent } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { TARGET_RECAP } from "~/core/constants";
import { useCreation } from "~/providers/CreationProvider";
import {
  getElementById,
  getElementsPositionGreaterEqual,
  getFollowingFormElement,
  isSectionOrQuestion,
} from "~/providers/CreationProvider/utils";
import { EntityWithNextElement, IUseTargetNextElementConfig } from "./types";

export const useTargetNextElement = <T extends EntityWithNextElement>({
  entity,
  positionReferenceElement,
  onSave,
}: IUseTargetNextElementConfig<T>) => {
  const { formElementsList } = useCreation();

  const followingElement = positionReferenceElement.position
    ? getFollowingFormElement(positionReferenceElement, formElementsList)
    : undefined;

  const elementsTwoPositionsAheadList = positionReferenceElement.position
    ? getElementsPositionGreaterEqual(positionReferenceElement.position + 2, formElementsList)
    : [];

  const computeInitialId = useCallback((): number | undefined => {
    if (
      entity.nextFormElementId == null ||
      !getElementById(entity.nextFormElementId, formElementsList, isSectionOrQuestion)
    ) {
      return undefined;
    }
    return entity.nextFormElementId;
  }, [entity, formElementsList]);

  const [targetNextElementId, setTargetNextElementId] = useState<number | undefined>(computeInitialId());

  const onChange = useCallback(
    (event: SelectChangeEvent) => {
      const raw = event.target.value;
      const value = raw !== TARGET_RECAP ? Number(raw) : undefined;
      const targetElement = value ? getElementById(value, formElementsList, isSectionOrQuestion) : null;

      setTargetNextElementId(value);

      // Create updated entity with new nextFormElementId and type
      const updatedEntity = {
        ...entity,
        nextFormElementId: value ?? null,
        nextFormElementType: targetElement?.formElementType ?? null,
      } as T;

      onSave(updatedEntity, value, targetElement?.formElementType ?? undefined);
    },
    [entity, formElementsList, onSave],
  );

  useEffect(() => {
    // If no target, nothing to do
    if (!targetNextElementId) return;

    // If there is no following element and nothing two positions ahead, clear the target
    if (!followingElement && !elementsTwoPositionsAheadList.length) {
      setTargetNextElementId(undefined);
      return;
    }

    // If there is a following element but nothing two positions ahead, set target to following element
    if (followingElement?.id && !elementsTwoPositionsAheadList.length) {
      if (targetNextElementId !== followingElement.id) setTargetNextElementId(followingElement.id);
      return;
    }

    // If the target element no longer exists in the list, clear the target
    if (!getElementById(targetNextElementId, formElementsList, isSectionOrQuestion)) {
      setTargetNextElementId(undefined);
      return;
    }

    return;
  }, [followingElement, elementsTwoPositionsAheadList, formElementsList, targetNextElementId]);

  return {
    targetNextElementId,
    followingElement,
    elementsTwoPositionsAheadList,
    onChange,
  };
};
