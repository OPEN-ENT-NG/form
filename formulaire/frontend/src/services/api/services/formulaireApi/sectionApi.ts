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
    createSection: builder.mutation<ISection, ISection>({
      query: (section) => ({
        url: `forms/${section.formId}/sections`,
        method: QueryMethod.POST,
        body: buildSectionPayload(section),
      }),
      invalidatesTags: [TagName.SECTIONS, TagName.FORM_ELEMENTS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.error.sectionService.create"), err);
          toast.error(t("formulaire.error.sectionService.create"));
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
    deleteSingleSection: builder.mutation<void, number>({
      query: (sectionId) => ({
        url: `/sections/${sectionId.toString()}`,
        method: QueryMethod.DELETE,
      }),
      invalidatesTags: [TagName.SECTIONS, TagName.FORM_ELEMENTS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(t("formulaire.success.element.delete"));
        } catch (err) {
          console.error(t("formulaire.error.questionService.delete"), err);
          toast.error(t("formulaire.error.questionService.delete"));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionsMutation,
  useDeleteSingleSectionMutation,
} = sectionApi;
