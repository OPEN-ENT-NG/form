import { IDistribution, IDistributionDTO } from "~/core/models/distribution/types.ts";
import { transformDistributions } from "~/core/models/distribution/utils.ts";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";

export const distributionsApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getFormDistributions: builder.query<IDistribution[], number>({
      query: (id: number) => `/distributions/forms/${id.toString()}/list`,
      transformResponse: (rawDatas: IDistributionDTO[]) => transformDistributions(rawDatas),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Erreur lors de la récupération des distributions:", error);
        }
      },
    }),
  }),
});
export const { useGetFormDistributionsQuery } = distributionsApi;
