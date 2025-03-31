import { DuplicateFormPayload, Form, FormPayload } from "~/core/models/form/types.ts";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";
import { QueryMethod, TagName } from "~/core/enums.ts";
import { toast } from "react-toastify";
import i18n from "~/i18n";
import { FORMULAIRE, TRASH_FOLDER_ID } from "~/core/constants";

export const formApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query<Form[], void>({
      query: () => ({
        url: `forms`,
        method: QueryMethod.GET,
      }),
      providesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.list", err);
          toast.error(i18n.t("formulaire.error.formService.list", { ns: FORMULAIRE }));
        }
      },
      transformResponse: (response: { data: Form[] }) => {
        return response?.data || response;
      },
    }),

    createForm: builder.mutation<Form, FormPayload>({
      query: (form) => ({
        url: `forms`,
        method: QueryMethod.POST,
        body: form,
      }),
      invalidatesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(i18n.t("formulaire.success.form.create", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.formService.create", err);
          toast.error(i18n.t("formulaire.error.formService.create", { ns: FORMULAIRE }));
        }
      },
      transformResponse: (response: { data: Form }) => {
        return response?.data || response;
      },
    }),

    updateForm: builder.mutation<any, { payload: FormPayload; formId: string; hasToastDisplay?: boolean }>({
      query: ({ payload, formId }) => ({
        url: `forms/${formId}`,
        method: QueryMethod.PUT,
        body: payload,
      }),
      invalidatesTags: [TagName.FORMS],
      async onQueryStarted({ hasToastDisplay = true }, { queryFulfilled }) {
        try {
          await queryFulfilled;
          if (hasToastDisplay) toast.success(i18n.t("formulaire.success.form.save", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.formService.update", err);
          toast.error(i18n.t("formulaire.error.formService.update", { ns: FORMULAIRE }));
        }
      },
      transformResponse: (response: { data: Form }) => {
        return response?.data || response;
      },
    }),

    deleteForm: builder.mutation<void, number>({
      query: (formId) => ({
        url: `forms/${formId}`,
        method: QueryMethod.DELETE,
      }),
      invalidatesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(i18n.t("formulaire.success.forms.delete", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.formService.delete", err);
          toast.error(i18n.t("formulaire.error.formService.delete", { ns: FORMULAIRE }));
        }
      },
    }),

    duplicateForms: builder.mutation<Form[], DuplicateFormPayload>({
      query: ({ formIds, folderId }) => ({
        url: `forms/duplicate/${folderId}`,
        method: QueryMethod.POST,
        body: formIds,
      }),
      invalidatesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(i18n.t("formulaire.success.forms.duplicate", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.formService.duplicate", err);
          toast.error(i18n.t("formulaire.error.formService.duplicate", { ns: FORMULAIRE }));
        }
      },
      transformResponse: (response: { data: Form[] }) => {
        return response?.data || response;
      },
    }),

    moveForm: builder.mutation<Form[], { formIds: number[]; destinationFolderId: number }>({
      query: ({ formIds, destinationFolderId }) => ({
        url: `forms/move/${destinationFolderId}`,
        method: QueryMethod.PUT,
        body: formIds,
      }),
      invalidatesTags: [TagName.FORMS],
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled;
          if (params.destinationFolderId !== TRASH_FOLDER_ID)
            toast.success(i18n.t("formulaire.success.move", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.formService.move", err);
          toast.error(i18n.t("formulaire.error.formService.move", { ns: FORMULAIRE }));
        }
      },
      transformResponse: (response: { data: Form[] }) => {
        return response?.data || response;
      },
    }),

    restoreForms: builder.mutation<Form[], number[]>({
      query: (formIds) => ({
        url: `forms/restore`,
        method: QueryMethod.PUT,
        body: formIds,
      }),
      invalidatesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(i18n.t("formulaire.success.forms.restore", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.formService.restore", err);
          toast.error(i18n.t("formulaire.error.formService.restore", { ns: FORMULAIRE }));
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
  useMoveFormMutation,
  useRestoreFormsMutation,
} = formApi;
