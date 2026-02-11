import { toast } from "react-toastify";

import { FORMULAIRE } from "~/core/constants.ts";
import { QueryMethod, TagName } from "~/core/enums.ts";
import { IDistribution, IDistributionCount, IDistributionDTO } from "~/core/models/distribution/types.ts";
import { transformDistribution, transformDistributions } from "~/core/models/distribution/utils.ts";
import { handleErrorApi } from "~/core/utils.ts";
import { t } from "~/i18n.ts";

import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";

export const distributionApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getDistribution: builder.query<IDistribution, number | string>({
      query: (distributionId: number | string) => ({
        url: `distributions/${distributionId}`,
        method: QueryMethod.GET,
      }),
      providesTags: [TagName.DISTRIBUTION],
      transformResponse: (rawDatas: IDistributionDTO) => transformDistribution(rawDatas),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.distributionService.get");
        }
      },
    }),
    getAllMyDistributions: builder.query<IDistribution[], void>({
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
          toast.error(t("formulaire.error.distributionService.list", { ns: FORMULAIRE }));
        }
      },
    }),
    getFormDistributions: builder.query<IDistribution[], number | string>({
      query: (formId: number | string) => `/distributions/forms/${formId.toString()}/list`,
      transformResponse: (rawDatas: IDistributionDTO[]) => transformDistributions(rawDatas),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Erreur lors de la récupération des distributions:", error);
        }
      },
    }),
    getMyFormDistributions: builder.query<IDistribution[], number | string>({
      query: (formId: number | string) => ({
        url: `distributions/forms/${formId}/listMine`,
        method: QueryMethod.GET,
      }),
      transformResponse: (rawDatas: IDistributionDTO[]) => transformDistributions(rawDatas),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.distributionService.list");
        }
      },
    }),
    addDistribution: builder.mutation<IDistribution, number>({
      query: (distributionId: number) => ({
        url: `/distributions/${distributionId}/add`,
        method: QueryMethod.POST,
      }),
      transformResponse: (rawData: IDistributionDTO) => transformDistribution(rawData),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.distributionService.create", err);
          toast.error(t("formulaire.error.distributionService.create", { ns: FORMULAIRE }));
        }
      },
    }),
    updateDistribution: builder.mutation<IDistribution, IDistribution>({
      query: (distribution: IDistribution) => ({
        url: `/distributions/${distribution.id}`,
        method: QueryMethod.PUT,
        body: distribution,
      }),
      transformResponse: (rawData: IDistributionDTO) => transformDistribution(rawData),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.distributionService.update", err);
          toast.error(t("formulaire.error.distributionService.update", { ns: FORMULAIRE }));
        }
      },
    }),
    replaceDistribution: builder.mutation<void, IDistribution>({
      query: (distribution: IDistribution) => ({
        url: `/distributions/${distribution.id}/replace/${distribution.originalId}`,
        method: QueryMethod.DELETE,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.distributionService.update", err);
          toast.error(t("formulaire.error.distributionService.update", { ns: FORMULAIRE }));
        }
      },
    }),
    countDistributions: builder.query<number, number>({
      query: (formId: number) => ({
        url: `distributions/forms/${formId}/count`,
        method: QueryMethod.GET,
      }),
      transformResponse: (data: IDistributionCount) => data.count,
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.distributionService.count");
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDistributionQuery,
  useGetAllMyDistributionsQuery,
  useGetFormDistributionsQuery,
  useGetMyFormDistributionsQuery,
  useAddDistributionMutation,
  useUpdateDistributionMutation,
  useReplaceDistributionMutation,
  useCountDistributionsQuery,
} = distributionApi;
