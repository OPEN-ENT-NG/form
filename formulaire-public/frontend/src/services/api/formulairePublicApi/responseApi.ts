import { toast } from "react-toastify";

import { QueryMethod } from "~/core/enums.ts";
import { IResponse } from "~/core/models/response/type.ts";
import { buildPublicResponsePayload } from "~/core/models/response/utils.ts";
import { t } from "~/i18n.ts";

import { emptySplitFormulairePublicApi } from "./emptySplitFormulairePublicApi.ts";

export const responseApi = emptySplitFormulairePublicApi.injectEndpoints({
  endpoints: (builder) => ({
    sendResponses: builder.mutation<
      void,
      { formKey: string; distributionKey: string; captchaResponse: string; responses: IResponse[] }
    >({
      query: ({ formKey, distributionKey, captchaResponse, responses }) => ({
        url: `responses/${formKey}/${distributionKey}`,
        method: QueryMethod.POST,
        body: buildPublicResponsePayload(captchaResponse, responses),
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
