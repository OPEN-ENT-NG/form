import { IDistribution, IDistributionDTO } from "~/core/models/distribution/types.ts";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";
import { QueryMethod, TagName } from "~/core/enums";
import { FORMULAIRE } from "~/core/constants.ts";
import i18n from "~/i18n.ts";
import { toast } from "react-toastify";
import { transformDistributions } from "~/core/models/distribution/utils.ts";

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
  }),
  overrideExisting: false,
});

export const { useGetDistributionQuery } = distributionApi;
