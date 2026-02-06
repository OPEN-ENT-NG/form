import { QueryMethod } from "~/core/enums.ts";
import { IResponseFile, IResponseFileDTO } from "~/core/models/response/type.ts";
import { handleErrorApi } from "~/core/utils.ts";

import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";

export const responseFileApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionFiles: builder.query<IResponseFile[], number>({
      query: (formId: number) => ({
        url: `forms/${formId}/files/all`,
        method: QueryMethod.GET,
      }),
      transformResponse: (rawDatas: IResponseFileDTO[]) =>
        rawDatas.map((rf) => ({ ...rf, responseId: rf.response_id })),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.responseFileService.list");
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetQuestionFilesQuery } = responseFileApi;
