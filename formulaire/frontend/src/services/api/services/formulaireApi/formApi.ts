import { DuplicateFormPayload, Form, FormPayload } from "~/core/models/form/types.ts";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";
import { TagName } from "~/core/enums.ts";

export const formApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query<Form[], void>({
      query: () => ({
        url: `forms`,
        method: "GET",
      }),
      providesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.list", err);
          throw new Error("formulaire.error.formService.list");
        }
      },
      transformResponse: (response: { data: Form[] }) => {
        return response?.data || response;
      },
    }),

    createForm: builder.mutation<Form, FormPayload>({
      query: (form) => ({
        url: `forms`,
        method: "POST",
        body: form,
      }),
      invalidatesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.create", err);
          throw new Error("formulaire.error.formService.create");
        }
      },
      transformResponse: (response: { data: Form }) => {
        return response?.data || response;
      },
    }),

    updateForm: builder.mutation<any, { payload: FormPayload; formId: string }>({
      query: ({ payload, formId }) => ({
        url: `forms/${formId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.update", err);
          throw new Error("formulaire.error.formService.update");
        }
      },
      transformResponse: (response: { data: Form }) => {
        return response?.data || response;
      },
    }),

    deleteForm: builder.mutation<void, number>({
      query: (formId) => ({
        url: `forms/${formId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.delete", err);
          throw new Error("formulaire.error.formService.delete");
        }
      },
    }),
    duplicateForms: builder.mutation<Form[], DuplicateFormPayload>({
      query: ({ formIds, folderId }) => ({
        url: `forms/duplicate/${folderId}`,
        method: "POST",
        body: formIds,
      }),
      invalidatesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.duplicate", err);
          throw new Error("formulaire.error.formService.duplicate");
        }
      },
      transformResponse: (response: { data: Form[] }) => {
        return response?.data || response;
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateFormMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
  useGetFormsQuery,
  useDuplicateFormsMutation,
} = formApi;
