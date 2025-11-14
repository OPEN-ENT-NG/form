import { TextField } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { ICursorTextFieldProps } from "./types";
import { ComponentSize, ComponentVariant } from "~/core/style/themeProps";
import { CursorTextFieldType } from "./enums";
import { FORMULAIRE } from "~/core/constants";
import { useTranslation } from "react-i18next";
import { getInputSlotProps } from "./utils";
import { CursorProp } from "../CreationQuestionTypes/CreationQuestionCursor/enums";
import { cursorTextFieldStyle } from "./style";
import { useGlobal } from "~/providers/GlobalProvider";

export const CursorTextField: FC<ICursorTextFieldProps> = ({
  type,
  isCurrentEditingElement,
  propName,
  onChange,
  inputValue,
  stepValue,
}) => {
  const { t } = useTranslation(FORMULAIRE);
  const { selectAllTextInput } = useGlobal();
  const isTypeNumber = type == CursorTextFieldType.NUMBER;
  const slotProps = getInputSlotProps(isCurrentEditingElement, isTypeNumber, inputValue, stepValue);

  return (
    <TextField
      type={propName === CursorProp.CURSOR_STEP ? "text" : type}
      variant={type == CursorTextFieldType.NUMBER ? ComponentVariant.OUTLINED : ComponentVariant.STANDARD}
      {...(isTypeNumber ? { size: ComponentSize.SMALL } : { placeholder: t("formulaire.question.label") })}
      slotProps={slotProps}
      onFocus={selectAllTextInput}
      onChange={onChange}
      sx={cursorTextFieldStyle}
    />
  );
};
