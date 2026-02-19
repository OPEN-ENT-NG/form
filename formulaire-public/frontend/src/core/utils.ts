import { toast } from "react-toastify";

import { t } from "~/i18n";

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

export const handleGetFormError = (err: unknown, errorMessageKey: string) => {
  if (
    typeof err === "object" &&
    err !== null &&
    "error" in err &&
    typeof err.error === "object" &&
    err.error != null &&
    "data" in err.error &&
    typeof err.error.data === "object" &&
    err.error.data != null &&
    "error" in err.error.data &&
    err.error.data.error &&
    typeof err.error.data.error === "string" &&
    err.error.data.error.includes("The form has already been answered")
  ) {
    window.location.href = "#/sorry";
  } else {
    console.error(errorMessageKey, err);
    toast.error(t(errorMessageKey));
  }
};
