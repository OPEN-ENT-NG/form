import { KeyName } from "./enums";
import { IUserInfo } from "@edifice.io/client";
import { IForm } from "./models/form/types";
import { sharingRights } from "./rights";

// KeyDown

export const isEnterPressed = (event: React.KeyboardEvent) => {
  return event.key === (KeyName.ENTER as string);
};

export const isShiftEnterPressed = (event: React.KeyboardEvent) => {
  return event.key === (KeyName.ENTER as string) && event.shiftKey;
};

// Rights

export const hasWorkflow = (user: IUserInfo | undefined, workflowName: string): boolean => {
  if (user === undefined) return false;

  return user.authorizedActions.some((workflowRight) => workflowRight.name === workflowName);
};

export const hasSharedRight = (user: IUserInfo | undefined, sharedRightName: string, form: IForm): boolean => {
  if (user === undefined) return false;
  if (!(sharedRightName in sharingRights)) return false;

  switch (sharedRightName) {
    case sharingRights.manager:
      return hasSharedRightManager(user, form);
    case sharingRights.contrib:
      return hasSharedRightContrib(user, form);
    case sharingRights.responder:
      return hasSharedRightResponse(user, form);
    default:
      return false;
  }
};

export const hasSharedRightManager = (user: IUserInfo | undefined, form: IForm): boolean => {
  if (user === undefined) return false;
  return form.owner_id === user.userId || form.rights.includes(sharingRights.manager);
};

export const hasSharedRightContrib = (user: IUserInfo | undefined, form: IForm): boolean => {
  if (user === undefined) return false;
  return form.owner_id === user.userId || form.rights.includes(sharingRights.contrib);
};

export const hasSharedRightResponse = (user: IUserInfo | undefined, form: IForm): boolean => {
  if (user === undefined) return false;
  return form.rights.includes(sharingRights.responder);
};

// Others

export const blockProps =
  (...propsToBlock: string[]) =>
  (prop: string) =>
    !propsToBlock.includes(prop);
