import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FORMULAIRE_PUBLIC } from "~/core/constants";

const delayBaseQuery = async (args: any, api: any, extraOptions: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0));

  return fetchBaseQuery({ baseUrl: `/${FORMULAIRE_PUBLIC}/` })(
    args,
    api,
    extraOptions,
  );
};

export const emptySplitApi = createApi({
  baseQuery: delayBaseQuery,
  tagTypes: [],
  endpoints: () => ({}),
});
