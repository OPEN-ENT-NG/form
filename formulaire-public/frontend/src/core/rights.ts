// Types
export interface IWorkflowRights {
  access: string;
}

export interface IUserWorkflowRights {
  [WorkflowRights.ACCESS]: boolean;
}

// Enums
export enum WorkflowRights {
  ACCESS = "ACCESS",
}

// Const
export const workflowRights: IWorkflowRights = {
  access: "fr.openent.formulaire_public.controllers.FormulairePublicController|initAccessRight",
};
