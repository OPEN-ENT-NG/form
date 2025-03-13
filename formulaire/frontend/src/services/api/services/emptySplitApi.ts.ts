import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FORMULAIRE } from "~/core/constants";

export const emptySplitApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `/${FORMULAIRE}/` }),
  tagTypes: ["Folder", "Folders"],
  endpoints: () => ({}),
});
