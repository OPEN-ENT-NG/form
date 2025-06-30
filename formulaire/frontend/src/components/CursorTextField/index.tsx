import { TextField } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { ICursorSlotProps, ICursorTextFieldProps } from "./types";
import { ComponentSize, ComponentVariant } from "~/core/style/themeProps";
import { CursorTextFieldType } from "./enums";
import { FORMULAIRE } from "~/core/constants";
import { useTranslation } from "react-i18next";

export const CursorTextField: FC<ICursorTextFieldProps> = ({
  type,
  isCurrentEditingElement,
  onChange,
  inputValue,
  stepValue,
}) => {
  const { t } = useTranslation(FORMULAIRE);
  const isTypeNumber = type == CursorTextFieldType.NUMBER;

  const getInputSlotProps = () => {
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

  return (
    <TextField
      type={type}
      variant={type == CursorTextFieldType.NUMBER ? ComponentVariant.OUTLINED : ComponentVariant.STANDARD}
      {...(isTypeNumber ? { size: ComponentSize.SMALL } : { placeholder: t("formulaire.question.label") })}
      slotProps={getInputSlotProps()}
      onChange={onChange}
    />
  );
};
