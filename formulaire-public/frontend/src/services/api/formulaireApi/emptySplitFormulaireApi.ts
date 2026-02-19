import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { FORMULAIRE } from "~/core/constants";

export const emptySplitFormulaireApi = createApi({
  reducerPath: "formulaireApi",
  baseQuery: fetchBaseQuery({ baseUrl: `/${FORMULAIRE}/` }),
  endpoints: () => ({}),
});
