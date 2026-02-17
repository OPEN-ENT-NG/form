import { KeyName } from "./enums";

// KeyDown
export const isEnterPressed = (event: React.KeyboardEvent) => {
  return event.key === (KeyName.ENTER as string);
};

export const isShiftEnterPressed = (event: React.KeyboardEvent) => {
  return event.key === (KeyName.ENTER as string) && event.shiftKey;
};

// Others

export const blockProps =
  (...propsToBlock: string[]) =>
  (prop: string) =>
    !propsToBlock.includes(prop);
