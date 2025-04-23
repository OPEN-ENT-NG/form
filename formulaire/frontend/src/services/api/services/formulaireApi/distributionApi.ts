import { IDistribution, IDistributionDTO } from "~/core/models/distribution/types.ts";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";
import { QueryMethod, TagName } from "~/core/enums";
import { FORMULAIRE } from "~/core/constants.ts";
import i18n from "~/i18n.ts";
import { toast } from "react-toastify";
import { transformDistribution, transformDistributions } from "~/core/models/distribution/utils.ts";

export const distributionApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getDistribution: builder.query<IDistribution[], void>({
      query: () => ({
        url: `distributions/listMine`,
        method: QueryMethod.GET,
      }),
      providesTags: [TagName.DISTRIBUTION],
      transformResponse: (rawDatas: IDistributionDTO[]) => transformDistributions(rawDatas),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.distributionService.list", err);
          toast.error(i18n.t("formulaire.error.distributionService.list", { ns: FORMULAIRE }));
        }
      },
    }),
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
    addDistribution: builder.mutation<IDistribution, number>({
      query: (distributionId: number) => ({
        url: `/distributions/${distributionId}/add`,
        method: QueryMethod.POST,
      }),
      transformResponse: (rawData: IDistributionDTO) => transformDistribution(rawData),
      invalidatesTags: [TagName.DISTRIBUTION],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.distributionService.create", err);
          toast.error(i18n.t("formulaire.error.distributionService.create", { ns: FORMULAIRE }));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetDistributionQuery, useGetFormDistributionsQuery, useAddDistributionMutation } = distributionApi;
