import { SelectChangeEvent } from "@mui/material";
import { useCallback } from "react";

import { TARGET_RECAP } from "~/core/constants";
import { useCreation } from "~/providers/CreationProvider";
import {
  getElementById,
  getElementsPositionGreaterEqual,
  getFollowingFormElement,
  isSectionOrQuestion,
} from "~/providers/CreationProvider/utils";

import { FormElementWithNextElement, IUseTargetNextElementConfig } from "./types";

export const useTargetNextElement = <T extends FormElementWithNextElement>({
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

  const onChange = useCallback(
    (event: SelectChangeEvent) => {
      const raw = event.target.value;
      const value = raw !== TARGET_RECAP ? Number(raw) : undefined;
      const targetElement = value ? getElementById(value, formElementsList, isSectionOrQuestion) : null;

      onSave(entity, value, targetElement?.formElementType ?? undefined);
    },
    [entity, formElementsList, onSave],
  );

  return {
    followingElement,
    elementsTwoPositionsAheadList,
    onChange,
  };
};
