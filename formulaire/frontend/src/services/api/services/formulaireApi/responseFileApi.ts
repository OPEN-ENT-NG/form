import { QueryMethod, TagName } from "~/core/enums.ts";
import { IResponseFile } from "~/core/models/response/type.ts";
import { handleErrorApi } from "~/core/utils.ts";

import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";

export const responseFileApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionFiles: builder.query<IResponseFile[], number>({
      query: (formId: number) => ({
        url: `forms/${formId}/files/all`,
        method: QueryMethod.GET,
      }),
      providesTags: [TagName.RESPONSE_FILE],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.responseFileService.list");
        }
      },
    }),
    createResponseFile: builder.mutation<void, { responseId: number; file: FormData }>({
      query: ({ responseId, file }) => ({
        url: `responses/${responseId}/files`,
        method: QueryMethod.POST,
        body: file,
        headers: {
          ContentType: "multipart/form-data",
        },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.responseFileService.create");
        }
      },
    }),
    deleteFilesByResponseIds: builder.mutation<void, { ids: (number | string)[]; isFileIds?: boolean }>({
      query: ({ ids, isFileIds = false }) => ({
        url: `responses/files/multiple?isFileIds=${isFileIds}`,
        method: QueryMethod.DELETE,
        body: ids,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          handleErrorApi(err, "formulaire.error.responseFileService.delete");
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetQuestionFilesQuery, useCreateResponseFileMutation, useDeleteFilesByResponseIdsMutation } =
  responseFileApi;
