import { QueryMethod, TagName } from "~/core/enums.ts";
import {
  IPdfImagesPayload,
  IResponse,
  IResponseDTO,
  IResponsePayload,
  IUploadedFileResponse,
} from "~/core/models/response/type.ts";
import { transformResponses } from "~/core/models/response/utils.ts";
import { handleErrorApi } from "~/core/utils.ts";

import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";

export const responseApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getDistributionResponses: builder.query<IResponse[], number | string>({
      query: (distributionId: number | string) => ({
        url: `distributions/${distributionId}/responses`,
        method: QueryMethod.GET,
      }),
      transformResponse: (rawDatas: IResponseDTO[]) => transformResponses(rawDatas),
      providesTags: [TagName.RESPONSE],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.responseService.list");
        }
      },
    }),
    createMultiple: builder.mutation<IResponse[], { distributionId: number; responses: IResponsePayload[] }>({
      query: ({ distributionId, responses }) => ({
        url: `distributions/${distributionId}/responses/multiple`,
        method: QueryMethod.POST,
        body: responses,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.responseService.create");
        }
      },
    }),
    updateMultiple: builder.mutation<IResponse[], { distributionId: number; responses: IResponsePayload[] }>({
      query: ({ distributionId, responses }) => ({
        url: `distributions/${distributionId}/responses`,
        method: QueryMethod.PUT,
        body: responses,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.responseService.update");
        }
      },
    }),
    deleteResponses: builder.mutation<void, { formId: number; responses: IResponsePayload[] }>({
      query: ({ formId, responses }) => ({
        url: `responses/${formId}`,
        method: QueryMethod.DELETE,
        body: responses,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.responseService.delete");
        }
      },
    }),
    deleteMultipleByQuestionAndDistribution: builder.mutation<void, { distributionId: number; questionIds: number[] }>({
      query: ({ distributionId, questionIds }) => ({
        url: `responses/${distributionId}/questions`,
        method: QueryMethod.DELETE,
        body: questionIds,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.responseService.delete");
        }
      },
    }),
    exportResponsesCsv: builder.mutation<void, number>({
      query: (formId: number) => ({
        url: `responses/export/${formId}/csv`,
        method: QueryMethod.POST,
        body: {},
        responseHandler: "text",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data, meta } = await queryFulfilled;
          const text = data;
          const blob = new Blob(["\ufeff" + text], { type: "text/csv;charset=utf-8" });

          const contentDisposition = meta?.response?.headers.get("Content-Disposition");
          const fileName = contentDisposition?.split("filename=")[1]?.replace(/['"]+/g, "") || `Réponses.csv`;

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        } catch (err) {
          handleErrorApi(err, "formulaire.error.responseService.export");
        }
      },
    }),
    exportResponsesPdf: builder.mutation<ArrayBuffer, { formId: number; images: IPdfImagesPayload }>({
      query: ({ formId, images }) => ({
        url: `responses/export/${formId}/pdf`,
        method: QueryMethod.POST,
        body: images,
        responseHandler: (response) => response.arrayBuffer(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data, meta } = await queryFulfilled;

          const blob = new Blob([data], {
            type: "application/pdf",
          });

          const contentDisposition = meta?.response?.headers.get("Content-Disposition");

          const fileName = contentDisposition?.split("filename=")[1] ?? "export.pdf";

          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName.replace(/['"]/g, "");

          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
          }, 100);
        } catch (err) {
          handleErrorApi(err, "formulaire.error.responseService.export");
        }
      },
    }),
    createFilesForPdfExport: builder.mutation<IUploadedFileResponse[], { filesFormData: FormData; nbFiles: number }>({
      query: ({ filesFormData, nbFiles }) => ({
        url: "/files",
        method: QueryMethod.POST,
        body: filesFormData,
        headers: {
          "Number-Files": String(nbFiles),
        },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.utilsService.postMultipleFiles");
        }
      },
    }),
    getAllResponses: builder.query<IResponse[], number>({
      query: (formId: number) => ({
        url: `/forms/${formId}/responses`,
        method: QueryMethod.GET,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDistributionResponsesQuery,
  useCreateMultipleMutation,
  useUpdateMultipleMutation,
  useDeleteResponsesMutation,
  useDeleteMultipleByQuestionAndDistributionMutation,
  useExportResponsesCsvMutation,
  useExportResponsesPdfMutation,
  useCreateFilesForPdfExportMutation,
  useGetAllResponsesQuery,
} = responseApi;
