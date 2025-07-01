import { ICursorSlotProps } from "./types";

export const getInputSlotProps = (
  isCurrentEditingElement: boolean,
  isTypeNumber: boolean,
  inputValue: string | number,
  stepValue: number | undefined,
) => {
  const slotProps: ICursorSlotProps = {
    input: {
      readOnly: !isCurrentEditingElement,
      sx: {
        pointerEvents: !isCurrentEditingElement ? "none" : "auto",
        caretColor: !isCurrentEditingElement ? "transparent" : "auto",
        width: isTypeNumber ? "100px" : "unset",
      },
    },
  };

  const commonInputProps = {
    value: inputValue,
  };

  if (isTypeNumber) {
    slotProps.htmlInput = {
      ...commonInputProps,
      step: stepValue,
      inputMode: "numeric",
      pattern: "[0-9]*",
      sx: {
        textAlign: "center",
      },
    };
  } else {
    slotProps.htmlInput = commonInputProps;
  }

  return slotProps;
};
