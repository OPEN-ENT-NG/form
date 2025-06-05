import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FORMULAIRE } from "~/core/constants";
import { TagName } from "~/core/enums";

export const emptySplitFormulaireApi = createApi({
  reducerPath: "formulaireApi",
  baseQuery: fetchBaseQuery({ baseUrl: `/${FORMULAIRE}/` }),
  tagTypes: [
    TagName.FOLDERS,
    TagName.FORMS,
    TagName.DISTRIBUTION,
    TagName.QUESTIONS,
    TagName.SECTIONS,
    TagName.FORM_ELEMENTS,
  ],
  endpoints: () => ({}),
});
