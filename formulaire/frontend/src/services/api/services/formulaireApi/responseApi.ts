import { QueryMethod } from "~/core/enums.ts";
import { handleErrorApi } from "~/core/utils.ts";

import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";

export const responseApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
  overrideExisting: false,
});

export const { useExportResponsesCsvMutation } = responseApi;
