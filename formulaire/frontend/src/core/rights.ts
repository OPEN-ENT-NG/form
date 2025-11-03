// Types
export interface IWorkflowRights {
  access: string;
  creation: string;
  response: string;
  rgpd: string;
  creationPublic: string;
}
export interface ISharedRights {
  read: string;
  contrib: string;
  manager: string;
  responder: string;
}

export interface IUserWorkflowRights {
  [WorkflowRights.ACCESS]: boolean;
  [WorkflowRights.CREATION]: boolean;
  [WorkflowRights.RESPONSE]: boolean;
  [WorkflowRights.RGPD]: boolean;
  [WorkflowRights.CREATION_PUBLIC]: boolean;
}

export interface IUserSharedRights {
  [SharedRights.READ]: boolean;
  [SharedRights.CONTRIB]: boolean;
  [SharedRights.MANAGE]: boolean;
  [SharedRights.RESPOND]: boolean;
}

// Enums
export enum WorkflowRights {
  ACCESS = "ACCESS",
  CREATION = "CREATION",
  RESPONSE = "RESPONSE",
  RGPD = "RGPD",
  CREATION_PUBLIC = "CREATION_PUBLIC",
}

export enum SharedRights {
  READ = "READ",
  CONTRIB = "CONTRIB",
  MANAGE = "MANAGE",
  RESPOND = "RESPOND",
}

// Const
export const workflowRights: IWorkflowRights = {
  access: "fr.openent.formulaire.controllers.FormulaireController|render",
  creation: "fr.openent.formulaire.controllers.FormController|initCreationRight",
  response: "fr.openent.formulaire.controllers.FormController|initResponseRight",
  rgpd: "fr.openent.formulaire.controllers.DelegateController|initRGPDRight",
  creationPublic: "fr.openent.formulaire.controllers.FormController|initCreationPublicRight",
};

export const sharingRights: ISharedRights = {
  read: "fr-openent-formulaire-controllers-FormController|initReadResourceRight",
  contrib: "fr-openent-formulaire-controllers-FormController|initContribResourceRight",
  manager: "fr-openent-formulaire-controllers-FormController|initManagerResourceRight",
  responder: "fr-openent-formulaire-controllers-FormController|initResponderResourceRight",
};
