import { QueryMethod, TagName } from "~/core/enums";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi";
import { FORMULAIRE } from "~/core/constants";
import i18n from "~/i18n";
import { toast } from "react-toastify";
import { ISection, ISectionDTO } from "~/core/models/section/types";
import { transformSections } from "~/core/models/section/utils";

export const sectionApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getSections: builder.query<ISection[], { formId: string }>({
      query: ({ formId }) => ({
        url: `forms/${formId}/sections`,
        method: QueryMethod.GET,
      }),
      providesTags: [TagName.FORMS],
      transformResponse: (rawDatas: ISectionDTO[]) => transformSections(rawDatas),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.sectionService.list", err);
          toast.error(i18n.t("formulaire.error.sectionService.list", { ns: FORMULAIRE }));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetSectionsQuery } = sectionApi;
