import { CursorTextFieldType } from "./enums";

export interface ICursorTextFieldProps {
  type: CursorTextFieldType;
  isCurrentEditingElement: boolean;
  onChangeCallback: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue: string | number;
  stepValue?: number;
}

export interface ICursorSlotProps {
  input: object;
  htmlInput?: object;
}
