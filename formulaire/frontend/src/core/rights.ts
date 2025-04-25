export const workflowRights = {
  access: "fr.openent.formulaire.controllers.FormulaireController|render",
  creation: "fr.openent.formulaire.controllers.FormController|initCreationRight",
  response: "fr.openent.formulaire.controllers.FormController|initResponseRight",
  rgpd: "fr.openent.formulaire.controllers.DelegateController|initRGPDRight",
  creationPublic: "fr.openent.formulaire.controllers.FormController|initCreationPublicRight",
};

export const sharingRights = {
  read: "fr-openent-formulaire-controllers-FormController|initReadResourceRight",
  contrib: "fr-openent-formulaire-controllers-FormController|initContribResourceRight",
  manager: "fr-openent-formulaire-controllers-FormController|initManagerResourceRight",
  responder: "fr-openent-formulaire-controllers-FormController|initResponderResourceRight",
};
