import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FORMULAIRE } from "~/core/constants";
import { TagName } from "~/core/enums";

export const emptySplitFormulaireApi = createApi({
  reducerPath: "formulaireApi",
  baseQuery: fetchBaseQuery({ baseUrl: `/${FORMULAIRE}/` }),
  tagTypes: [TagName.FOLDERS, TagName.FORMS],
  endpoints: () => ({}),
});
