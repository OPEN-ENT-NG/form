import { Form } from "~/core/models/form/types";
import { RightStringified, UserFormsRight } from "./types";

export const buildUserFormsRight = (datas: any[], forms: Form[]) => {
  // Mapping object from raw action identifiers to our RightStringified values
  const rightsMapping: Record<string, RightStringified> = {
    initManagerResourceRight: "manager",
    initContribResourceRight: "contrib",
    initResponderResourceRight: "comment",
  };

  // First, group rights by form id (resource_id)
  const rightsByFormId: Record<number, Set<RightStringified>> = datas.reduce(
    (acc, data) => {
      const formId: number = data.resource_id;
      // Check if action contains one of the keys in our rightsMapping
      Object.keys(rightsMapping).forEach((key) => {
        if (data.action.includes(key)) {
          if (!acc[formId]) {
            acc[formId] = new Set<RightStringified>();
          }
          acc[formId].add(rightsMapping[key]);
        }
      });
      return acc;
    },
    {} as Record<number, Set<RightStringified>>,
  );

  // Now, map each Form to its corresponding rights (or an empty array if none found)
  const userFormsRight: UserFormsRight[] = forms.map((form) => {
    const rightsSet = rightsByFormId[form.id] || new Set<RightStringified>();
    return {
      form,
      rights: Array.from(rightsSet),
    };
  });

  return userFormsRight;
};
