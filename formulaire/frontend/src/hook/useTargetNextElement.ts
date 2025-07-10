import { SelectChangeEvent } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { TARGET_RECAP } from "~/core/constants";
import { ISection } from "~/core/models/section/types";
import { useCreation } from "~/providers/CreationProvider";
import {
  getElementById,
  getElementsPositionGreaterEqual,
  getFollowingFormElement,
  isSectionOrQuestion,
} from "~/providers/CreationProvider/utils";

export const useTargetNextElement = (section?: ISection) => {
  const { formElementsList, saveSection } = useCreation();
  const followingElement = section ? getFollowingFormElement(section, formElementsList) : undefined;

  const elementsTwoPositionsAheadList = section?.position
    ? getElementsPositionGreaterEqual(section.position + 2, formElementsList)
    : [];

  const computeInitialId = useCallback((): number | undefined => {
    if (
      !section ||
      section.nextFormElementId == null ||
      !getElementById(section.nextFormElementId, formElementsList, isSectionOrQuestion)
    ) {
      return undefined;
    }
    return section.nextFormElementId;
  }, [section, formElementsList, followingElement]);

  const [targetNextElementId, setTargetNextElementId] = useState<number | undefined>(computeInitialId());

  const onChange = useCallback(
    (event: SelectChangeEvent) => {
      const raw = event.target.value;
      const value = raw !== TARGET_RECAP ? Number(raw) : undefined;
      const targetElement = value ? getElementById(value, formElementsList, isSectionOrQuestion) : null;

      setTargetNextElementId(value);
      if (!section) return;
      void saveSection({
        ...section,
        nextFormElementId: value ?? null,
        nextFormElementType: targetElement?.formElementType ?? null,
      });
    },
    [section, formElementsList, saveSection],
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
  }, [followingElement, elementsTwoPositionsAheadList, formElementsList]);

  return {
    targetNextElementId,
    followingElement,
    elementsTwoPositionsAheadList,
    onChange,
  };
};
