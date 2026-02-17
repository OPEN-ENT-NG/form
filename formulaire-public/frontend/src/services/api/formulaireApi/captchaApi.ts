import { toast } from "react-toastify";

import { QueryMethod, TagName } from "~/core/enums";
import { ICaptcha } from "~/core/models/captcha/types";
import { t } from "~/i18n";

import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi";

export const captchaApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getCaptcha: builder.query<ICaptcha, { distributionKey: string; distributionCaptcha?: number }>({
      query: ({ distributionKey, distributionCaptcha }) => ({
        url: `captcha/${distributionKey}?captcha_id=${distributionCaptcha?.toString()}`,
        method: QueryMethod.GET,
      }),
      transformResponse: (response: ICaptcha) => response,
      providesTags: [TagName.CAPTCHA],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.public.error.captchaService.get"), err);
          toast.error(t("formulaire.public.error.captchaService.get"));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetCaptchaQuery } = captchaApi;
