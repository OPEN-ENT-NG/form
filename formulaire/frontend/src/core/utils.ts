import { KeyName } from "./enums";
import { IUserInfo } from "@edifice.io/client";
import { toast } from "react-toastify";
import { t } from "~/i18n";
import { getHrefErrorPath } from "./pathHelper";

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

export const getErrorCode = (err: unknown): number | string | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const e = err as any;
  /* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */
  return (
    e?.status ??
    e?.originalStatus ??
    e?.error?.originalStatus ??
    e?.error ??
    (err instanceof Error ? err.name : undefined)
  );
};

export const handleErrorApi = (err: unknown, errorMessageKey: string) => {
  const errorCode = getErrorCode(err);
  switch (errorCode) {
    case 401:
    case 403:
    case 404:
      window.location.href = getHrefErrorPath(errorCode);
      break;
    default:
      console.error(errorMessageKey, err);
      toast.error(t(errorMessageKey));
  }
};
