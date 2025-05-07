import { QueryMethod } from "~/core/enums";
import { emptySplitArchiveApi } from "./emptySplitArchiveApi";
import {
  IImportAnalyseResponseApp,
  IImportAnalyzeResponse,
  IImportLaunchResponse,
  IImportUploadResponse,
} from "~/core/models/import/types";
import { FORMULAIRE } from "~/core/constants";
import { toast } from "react-toastify";
import { t } from "~/i18n";

export const importExportApi = emptySplitArchiveApi.injectEndpoints({
  endpoints: (builder) => ({
    // Upload forms
    uploadImportForms: builder.mutation<IImportUploadResponse, FormData>({
      query: (formData) => ({
        url: "import/upload",
        method: QueryMethod.POST,
        body: formData,
      }),
      transformResponse: (response: IImportUploadResponse) => response,
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.import", err);
          toast.error(t("formulaire.error.formService.import", { ns: FORMULAIRE }));
        }
      },
    }),

    // AnalyzeImport
    analyzeImportForms: builder.query<IImportAnalyzeResponse, string>({
      query: (importId) => ({
        url: `import/analyze/${importId}`,
        method: QueryMethod.GET,
      }),
      transformResponse: (response: IImportAnalyzeResponse) => response,
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.import", err);
          toast.error(t("formulaire.error.formService.import", { ns: FORMULAIRE }));
        }
      },
    }),

    // LaunchImport
    launchImportForms: builder.query<IImportLaunchResponse, { importId: string; apps: IImportAnalyseResponseApp[] }>({
      query: ({ importId, apps }) => ({
        url: `import/${importId}/launch`,
        method: QueryMethod.POST,
        body: { apps: apps },
      }),
      transformResponse: (response: IImportLaunchResponse) => response,
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.import", err);
          toast.error(t("formulaire.error.formService.import", { ns: FORMULAIRE }));
        }
      },
    }),

    verifyExportAndDownloadZip: builder.mutation<void, string>({
      query: (exportId) => ({
        url: `export/verify/${exportId}`,
        method: QueryMethod.GET,
      }),
      async onQueryStarted(exportId, { queryFulfilled }) {
        try {
          await queryFulfilled;
          window.location.href = `/archive/export/${exportId}`;
        } catch (err) {
          console.error("Error verifying export and downloading zip:", err);
          toast.error(t("formulaire.error.formService.export", { ns: FORMULAIRE }));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useUploadImportFormsMutation,
  useLazyAnalyzeImportFormsQuery,
  useLazyLaunchImportFormsQuery,
  useVerifyExportAndDownloadZipMutation,
} = importExportApi;
