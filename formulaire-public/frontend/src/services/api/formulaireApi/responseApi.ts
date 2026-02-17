import { toast } from "react-toastify";

import { QueryMethod } from "~/core/enums.ts";
import { IResponse } from "~/core/models/response/type.ts";
import { buildPublicResponsePayload } from "~/core/models/response/utils.ts";
import { t } from "~/i18n.ts";

import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";

export const responseApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    sendResponses: builder.mutation<
      void,
      { formKey: string; distributionKey: string; responseCaptcha: IResponse; responses: IResponse[] }
    >({
      query: ({ formKey, distributionKey, responseCaptcha, responses }) => ({
        url: `responses/${formKey}/${distributionKey}`,
        method: QueryMethod.POST,
        body: buildPublicResponsePayload(responseCaptcha, responses),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.public.error.responseService.create"), err);
          toast.error(t("formulaire.public.error.responseService.create"));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useSendResponsesMutation } = responseApi;
