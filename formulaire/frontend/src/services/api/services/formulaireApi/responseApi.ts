import { toast } from "react-toastify";

import { FORMULAIRE } from "~/core/constants.ts";
import { QueryMethod } from "~/core/enums.ts";
import { IResponse, IResponseDTO } from "~/core/models/response/type.ts";
import { transformResponses } from "~/core/models/response/utils.ts";
import { handleErrorApi } from "~/core/utils.ts";
import { t } from "~/i18n.ts";

import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";

export const responseApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getDistributionResponses: builder.query<IResponse[], number | string>({
      query: (distributionId: number | string) => ({
        url: `distributions/${distributionId}/responses`,
        method: QueryMethod.GET,
      }),
      transformResponse: (rawDatas: IResponseDTO[]) => transformResponses(rawDatas),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.responseService.list");
        }
      },
    }),
    deleteResponses: builder.mutation<void, { formId: number; responses: IResponse[] }>({
      query: ({ formId, responses }) => ({
        url: `/responses/${formId}`,
        method: QueryMethod.DELETE,
        body: { responses },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.responseService.delete", err);
          toast.error(t("formulaire.error.responseService.delete", { ns: FORMULAIRE }));
        }
      },
    }),
    exportResponsesCsv: builder.mutation<void, number>({
      query: (formId: number) => ({
        url: `/responses/export/${formId}/csv`,
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
    getAllResponses: builder.query<IResponse[], number>({
      query: (formId: number) => ({
        url: `/forms/${formId}/responses`,
        method: QueryMethod.GET,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetDistributionResponsesQuery, useDeleteResponsesMutation, useExportResponsesCsvMutation, useGetAllResponsesQuery } =
  responseApi;
