import { odeServices } from "edifice-ts-client";

export const getApp = async (url: string): Promise<void> => {
  return await odeServices.http().get(url);
};

/**
 * sessionHasWorkflowRights API
 * @param actionRights
 * @returns check if user has rights
 */
export const sessionHasWorkflowRights = async (actionRights: string[]) => {
  return await odeServices.rights().sessionHasWorkflowRights(actionRights);
};
