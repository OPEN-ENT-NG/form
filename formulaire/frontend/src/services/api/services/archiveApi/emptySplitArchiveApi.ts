import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ARCHIVE } from "~/core/constants";
import { TagName } from "~/core/enums";

export const emptySplitArchiveApi = createApi({
  reducerPath: "archiveApi",
  baseQuery: fetchBaseQuery({ baseUrl: `/${ARCHIVE}/` }),
  tagTypes: [TagName.FORMS],
  endpoints: () => ({}),
});
