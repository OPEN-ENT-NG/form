import { TextField } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { ICursorTextFieldProps } from "./types";
import { ComponentSize, ComponentVariant } from "~/core/style/themeProps";
import { CursorTextFieldType } from "./enums";
import { FORMULAIRE } from "~/core/constants";
import { useTranslation } from "react-i18next";
import { getInputSlotProps } from "./utils";

export const CursorTextField: FC<ICursorTextFieldProps> = ({
  type,
  isCurrentEditingElement,
  onChange,
  inputValue,
  stepValue,
}) => {
  const { t } = useTranslation(FORMULAIRE);
  const isTypeNumber = type == CursorTextFieldType.NUMBER;
  const slotProps = getInputSlotProps(isCurrentEditingElement, isTypeNumber, inputValue, stepValue);

  return (
    <TextField
      type={type}
      variant={type == CursorTextFieldType.NUMBER ? ComponentVariant.OUTLINED : ComponentVariant.STANDARD}
      {...(isTypeNumber ? { size: ComponentSize.SMALL } : { placeholder: t("formulaire.question.label") })}
      slotProps={slotProps}
      onChange={onChange}
    />
  );
};
