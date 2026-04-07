import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { ARCHIVE } from "~/core/constants";
import { TagName } from "~/core/enums";

export const emptySplitArchiveApi = createApi({
  reducerPath: "archiveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/${ARCHIVE}/`,
    prepareHeaders: (headers) => {
      const xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      if (xsrfToken) {
        headers.set("X-XSRF-TOKEN", decodeURIComponent(xsrfToken));
      }

      return headers;
    },
  }),
  tagTypes: [TagName.FORMS],
  endpoints: () => ({}),
});
