import { IDelegate } from "~/core/models/delegate/types.ts";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";

export const delegateApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getDelegates: builder.query<IDelegate, void>({
      query: () => "delegates",
      transformResponse: (response: IDelegate[]) => response[0],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDelegatesQuery } = delegateApi;
