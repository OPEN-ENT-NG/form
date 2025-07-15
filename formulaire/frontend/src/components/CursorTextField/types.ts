import { CursorProp } from "../CreationQuestionTypes/CreationQuestionCursor/enums";
import { CursorTextFieldType } from "./enums";

export interface ICursorTextFieldProps {
  type: CursorTextFieldType;
  isCurrentEditingElement: boolean;
  propName: CursorProp;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue: string | number;
  stepValue?: number;
}

export interface ICursorSlotProps {
  input: object;
  htmlInput?: object;
}
