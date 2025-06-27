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
  onChangeCallback,
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

    if (isTypeNumber) {
      slotProps.htmlInput = {
        value: inputValue,
        step: stepValue,
        inputMode: "numeric",
        pattern: "[0-9]*",
        sx: {
          textAlign: "center",
        },
      };
    }

    return slotProps;
  };

  return (
    <TextField
      type={type}
      variant={type == CursorTextFieldType.NUMBER ? ComponentVariant.OUTLINED : ComponentVariant.STANDARD}
      {...(isTypeNumber
        ? { size: ComponentSize.SMALL }
        : { label: inputValue, placeholder: t("formulaire.question.label") })}
      disabled={!isCurrentEditingElement}
      slotProps={getInputSlotProps()}
      onChange={onChangeCallback}
    />
  );
};
