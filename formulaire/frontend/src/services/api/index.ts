import { odeServices } from "@edifice.io/client";

export const getApp = async (url: string): Promise<void> => {
  await odeServices.http().get(url);
};

/**
 * sessionHasWorkflowRights API
 * @param actionRights
 * @returns check if user has rights
 */
export const sessionHasWorkflowRights = async (actionRights: string[]) => {
  return await odeServices.rights().sessionHasWorkflowRights(actionRights);
};
