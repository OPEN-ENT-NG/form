import { QueryMethod } from "~/core/enums";
import { emptySplitArchiveApi } from "./emptySplitArchiveApi";
import {
  ImportAnalyseResponseApp,
  ImportAnalyzeResponse,
  ImportLaunchResponse,
  ImportUploadResponse,
} from "~/core/models/import/types";

export const importExportApi = emptySplitArchiveApi.injectEndpoints({
  endpoints: (builder) => ({
    // Upload forms
    uploadImportForms: builder.mutation<ImportUploadResponse, FormData>({
      query: (formData) => ({
        url: "import/upload",
        method: QueryMethod.POST,
        body: formData,
      }),
      transformResponse: (response: ImportUploadResponse) => response,
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.import", err);
          throw new Error("formulaire.error.formService.import");
        }
      },
    }),

    // AnalyzeImport
    analyzeImportForms: builder.query<ImportAnalyzeResponse, string>({
      query: (importId) => ({
        url: `import/analyze/${importId}`,
        method: QueryMethod.GET,
      }),
      transformResponse: (response: ImportAnalyzeResponse) => response,
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.import", err);
          throw new Error("formulaire.error.formService.import");
        }
      },
    }),

    // LaunchImport
    launchImportForms: builder.query<ImportLaunchResponse, { importId: string; apps: ImportAnalyseResponseApp[] }>({
      query: ({ importId, apps }) => ({
        url: `import/${importId}/launch`,
        method: QueryMethod.POST,
        body: { apps: apps },
      }),
      transformResponse: (response: ImportLaunchResponse) => response,
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.import", err);
          throw new Error("formulaire.error.formService.import");
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useUploadImportFormsMutation, useLazyAnalyzeImportFormsQuery, useLazyLaunchImportFormsQuery } =
  importExportApi;
