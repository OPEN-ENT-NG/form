import { Delegate } from "~/core/models/delegate/types.ts";
import { emptySplitApi } from "./emptySplitApi.ts";

export const delegateApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getDelegates: builder.query<Delegate, void>({
      query: () => "delegates",
      transformResponse: (response: Delegate[]) => response[0],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDelegatesQuery } = delegateApi;
