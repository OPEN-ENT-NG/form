import { KeyName } from "./enums";
import { IUserInfo } from "@edifice.io/client";

export const isEnterPressed = (event: React.KeyboardEvent) => {
  return event.key === (KeyName.ENTER as string);
};

export const hasWorkflow = (user: IUserInfo | undefined, workflowName: string): boolean => {
  if (user === undefined) return false;

  return (
    user.authorizedActions.findIndex((workflowRight) => {
      return workflowRight.name === workflowName;
    }) !== -1
  );
};
