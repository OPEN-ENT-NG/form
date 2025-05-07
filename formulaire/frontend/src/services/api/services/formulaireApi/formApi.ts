import {
  IDuplicateFormPayload,
  IForm,
  IFormPayload,
  IFormReminderPayload,
  IFormRight,
} from "~/core/models/form/types.ts";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";
import { QueryMethod, TagName } from "~/core/enums.ts";
import { toast } from "react-toastify";
import { t } from "~/i18n";
import { FORMULAIRE, ID, LINK_HTML_ELEMENT, PDF_EXTENSION, TRASH_FOLDER_ID, ZIP_EXTENSION } from "~/core/constants";

export const formApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query<IForm[], void>({
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
          toast.error(t("formulaire.error.formService.list", { ns: FORMULAIRE }));
        }
      },
    }),
    getSentForms: builder.query<IForm[], void>({
      query: () => ({
        url: `forms/sent`,
        method: QueryMethod.GET,
      }),
      providesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.list", err);
          toast.error(t("formulaire.error.formService.list", { ns: FORMULAIRE }));
        }
      },
    }),

    createForm: builder.mutation<IForm, IFormPayload>({
      query: (form) => ({
        url: `forms`,
        method: QueryMethod.POST,
        body: form,
      }),
      invalidatesTags: [TagName.FORMS, TagName.FOLDERS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(t("formulaire.success.form.create", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.formService.create", err);
          toast.error(t("formulaire.error.formService.create", { ns: FORMULAIRE }));
        }
      },
    }),

    updateForm: builder.mutation<IForm, { payload: IFormPayload; formId: string; hasToastDisplay?: boolean }>({
      query: ({ payload, formId }) => ({
        url: `forms/${formId}`,
        method: QueryMethod.PUT,
        body: payload,
      }),
      invalidatesTags: [TagName.FORMS, TagName.FOLDERS],
      async onQueryStarted({ hasToastDisplay = true }, { queryFulfilled }) {
        try {
          await queryFulfilled;
          if (hasToastDisplay) toast.success(t("formulaire.success.form.save", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.formService.update", err);
          toast.error(t("formulaire.error.formService.update", { ns: FORMULAIRE }));
        }
      },
    }),

    deleteForm: builder.mutation<void, number>({
      query: (formId) => ({
        url: `forms/${formId.toString()}`,
        method: QueryMethod.DELETE,
      }),
      invalidatesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(t("formulaire.success.forms.delete", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.formService.delete", err);
          toast.error(t("formulaire.error.formService.delete", { ns: FORMULAIRE }));
        }
      },
    }),

    duplicateForms: builder.mutation<IForm[], IDuplicateFormPayload>({
      query: ({ formIds, folderId }) => ({
        url: `forms/duplicate/${folderId.toString()}`,
        method: QueryMethod.POST,
        body: formIds,
      }),
      invalidatesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(t("formulaire.success.forms.duplicate", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.formService.duplicate", err);
          toast.error(t("formulaire.error.formService.duplicate", { ns: FORMULAIRE }));
        }
      },
    }),

    moveForms: builder.mutation<IForm[], { formIds: number[]; destinationFolderId: number }>({
      query: ({ formIds, destinationFolderId }) => ({
        url: `forms/move/${destinationFolderId.toString()}`,
        method: QueryMethod.PUT,
        body: formIds,
      }),
      invalidatesTags: [TagName.FORMS, TagName.FOLDERS],
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled;
          if (params.destinationFolderId !== TRASH_FOLDER_ID)
            toast.success(t("formulaire.success.move", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.formService.move", err);
          toast.error(t("formulaire.error.formService.move", { ns: FORMULAIRE }));
        }
      },
    }),

    restoreForms: builder.mutation<IForm[], number[]>({
      query: (formIds) => ({
        url: `forms/restore`,
        method: QueryMethod.PUT,
        body: formIds,
      }),
      invalidatesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(t("formulaire.success.forms.restore", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.formService.restore", err);
          toast.error(t("formulaire.error.formService.restore", { ns: FORMULAIRE }));
        }
      },
    }),
    exportPdfForm: builder.query<Blob, IForm[]>({
      query: (forms) => {
        const params = new URLSearchParams();
        forms.forEach((form) => {
          params.append(ID, form.id.toString());
        });
        return {
          url: `forms/export/pdf?${params}`,
          method: QueryMethod.GET,
          responseHandler: (response) => response.blob(),
        };
      },
      async onQueryStarted(forms, { queryFulfilled }) {
        try {
          if (!forms.length) return;
          const { data: blob } = await queryFulfilled;

          const fileName =
            forms.length > 1
              ? t("formulaire.export.pdf.questions.title") + ZIP_EXTENSION
              : forms[0].title.replace(/\s+/g, "_") + PDF_EXTENSION;

          // Create a download link and trigger the download
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement(LINK_HTML_ELEMENT);
          link.href = downloadUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(downloadUrl);
        } catch (err) {
          console.error("formulaire.error.formService.export", err);
          toast.error(t("formulaire.error.formService.export", { ns: FORMULAIRE }));
        }
      },
    }),
    exportZip: builder.mutation<string, number[]>({
      query: (formIds) => ({
        url: "forms/export/zip",
        method: QueryMethod.POST,
        body: formIds,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.export", err);
          toast.error(t("formulaire.error.formService.export", { ns: FORMULAIRE }));
        }
      },
      transformResponse: (response: { status: string; exportId: string; exportPath: string }) => {
        return response.exportId;
      },
    }),
    getUserFormsRights: builder.query<IFormRight[], void>({
      query: () => ({
        url: `forms/rights/all`,
        method: QueryMethod.GET,
      }),
      providesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.rights", err);
          toast.error(t("formulaire.error.formService.rights", { ns: FORMULAIRE }));
        }
      },
    }),
    sendReminder: builder.mutation<void, IFormReminderPayload>({
      query: ({ formId, mail }) => ({
        url: `forms/${formId}/remind`,
        method: QueryMethod.POST,
        body: mail,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(t("formulaire.success.reminder.send", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.formService.remind", err);
        }
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
  useGetSentFormsQuery,
  useDuplicateFormsMutation,
  useMoveFormsMutation,
  useRestoreFormsMutation,
  useExportPdfFormQuery,
  useLazyExportPdfFormQuery,
  useExportZipMutation,
  useGetUserFormsRightsQuery,
  useSendReminderMutation,
} = formApi;
