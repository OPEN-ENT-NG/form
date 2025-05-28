import { QueryMethod, TagName } from "~/core/enums";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi";
import { toast } from "react-toastify";
import { ISection, ISectionDTO } from "~/core/models/section/types";
import { buildSectionPayload, transformSections } from "~/core/models/section/utils";
import { t } from "~/i18n";

export const sectionApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getSections: builder.query<ISection[], { formId: string }>({
      query: ({ formId }) => ({
        url: `forms/${formId}/sections`,
        method: QueryMethod.GET,
      }),
      providesTags: [TagName.SECTIONS, TagName.FORM_ELEMENTS],
      transformResponse: (rawDatas: ISectionDTO[]) => transformSections(rawDatas),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.error.sectionService.list"), err);
          toast.error(t("formulaire.error.sectionService.list"));
        }
      },
    }),
    updateSections: builder.mutation<ISection[], ISection[]>({
      query: (sections) => ({
        url: `forms/${sections[0].formId}/sections`,
        method: QueryMethod.PUT,
        body: sections.map((section) => buildSectionPayload(section)),
      }),
      invalidatesTags: [TagName.SECTIONS, TagName.FORM_ELEMENTS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.error.sectionService.update"), err);
          toast.error(t("formulaire.error.sectionService.update"));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetSectionsQuery, useUpdateSectionsMutation } = sectionApi;
