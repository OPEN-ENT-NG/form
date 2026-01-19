import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FORMULAIRE_PUBLIC } from "~/core/constants";
import { TagName } from "~/core/enums";

export const emptySplitFormulaireApi = createApi({
  reducerPath: "formulaireApi",
  baseQuery: fetchBaseQuery({ baseUrl: `/${FORMULAIRE_PUBLIC}/` }),
  tagTypes: [
    TagName.FOLDERS,
    TagName.FORMS,
    TagName.DISTRIBUTION,
    TagName.QUESTIONS,
    TagName.SECTIONS,
    TagName.FORM_ELEMENTS,
    TagName.CHOICE,
    TagName.CHILDREN,
  ],
  endpoints: () => ({}),
});
