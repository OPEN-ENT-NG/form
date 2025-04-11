import { ShareRight, ShareRightAction, ShareRightActionDisplayName } from "@edifice.io/client";
import { IUserFormsRight } from "~/providers/ShareModalProvider/types";

export const hasRight = (shareRight: ShareRight, shareAction: ShareRightAction): boolean => {
  return shareRight.actions.filter((a: { id: ShareRightActionDisplayName }) => shareAction.id === a.id).length > 0;
};

export const userHasRight = (
  userFormsRights: IUserFormsRight[],
  formId: number,
  rightId: ShareRightActionDisplayName,
) => {
  const selectedFormRight = userFormsRights.find((item) => item.form.id === formId);

  if (!selectedFormRight) {
    return false;
  }
  return !!selectedFormRight.rights.find((right) => right === rightId);
};
