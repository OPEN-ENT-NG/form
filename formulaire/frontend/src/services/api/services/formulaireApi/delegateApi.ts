import { Delegate } from "~/core/models/delegate/types.ts";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";

export const delegateApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getDelegates: builder.query<Delegate, void>({
      query: () => "delegates",
      transformResponse: (response: Delegate[]) => response[0],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDelegatesQuery } = delegateApi;
