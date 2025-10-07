import { KeyName } from "./enums";
import { IUserInfo } from "@edifice.io/client";

export const isEnterPressed = (event: React.KeyboardEvent) => {
  return event.key === (KeyName.ENTER as string);
};

export const isShiftEnterPressed = (event: React.KeyboardEvent) => {
  return event.key === (KeyName.ENTER as string) && event.shiftKey;
};

export const hasWorkflow = (user: IUserInfo | undefined, workflowName: string): boolean => {
  if (user === undefined) return false;

  return user.authorizedActions.some((workflowRight) => workflowRight.name === workflowName);
};

export const blockProps =
  (...propsToBlock: string[]) =>
  (prop: string) =>
    !propsToBlock.includes(prop);
