import { COMMENT_RIGHT, CONTRIB_RIGHT, MANAGER_RIGHT } from "~/core/constants";
import { IForm, IFormRight } from "~/core/models/form/types";

import { IUserFormsRight, RightStringified } from "./types";

export const buildUserFormsRight = (datas: IFormRight[], forms: IForm[]) => {
  // Mapping object from raw action identifiers to our RightStringified values
  const rightsMapping: Record<string, RightStringified> = {
    initManagerResourceRight: MANAGER_RIGHT,
    initContribResourceRight: CONTRIB_RIGHT,
    initResponderResourceRight: COMMENT_RIGHT,
  };

  // First, group rights by form id (resource_id)
  const rightsByFormId: Partial<Record<number, Set<RightStringified>>> = datas.reduce<
    Partial<Record<number, Set<RightStringified>>>
  >((acc, data) => {
    const formId: number = data.resource_id;
    // Check if action contains one of the keys in our rightsMapping
    Object.keys(rightsMapping).forEach((key) => {
      if (data.action.includes(key)) {
        // Initialize the Set only if it doesn't exist yet
        if (!acc[formId]) {
          acc[formId] = new Set<RightStringified>();
        }
        acc[formId].add(rightsMapping[key]);
      }
    });
    return acc;
  }, {});

  // Now, map each Form to its corresponding rights (or an empty array if none found)
  const userFormsRights: IUserFormsRight[] = forms.map((form) => {
    const rightsSet = rightsByFormId[form.id];
    return {
      form,
      rights: rightsSet ? Array.from(rightsSet) : [],
    };
  });

  return userFormsRights;
};
