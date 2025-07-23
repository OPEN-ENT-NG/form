/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAction } from "@edifice.io/client";
import { useQuery } from "@tanstack/react-query";

import { sessionHasWorkflowRights } from "../api";
import { workflowRights } from "~/core/rights";

/**
 * useActions query
 * set actions correctly with workflow rights
 * @returns actions data
 */
export const useActions = () => {
  const { access } = workflowRights;

  return useQuery<Record<string, boolean>, Error, IAction[]>({
    queryKey: ["actions"],
    queryFn: async () => {
      const availableRights = await sessionHasWorkflowRights([access]);
      return availableRights;
    },
    select: (data) => {
      const actions: any[] = [
        {
          id: "access",
          workflow: access,
          available: data[access] || false,
        },
      ];
      return actions;
    },
  });
};
