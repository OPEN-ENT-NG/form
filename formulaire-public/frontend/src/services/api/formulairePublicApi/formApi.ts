import { toast } from "react-toastify";

import { QueryMethod, TagName } from "~/core/enums.ts";
import { IPublicFormDTO } from "~/core/models/form/types.ts";
import { t } from "~/i18n";

import { emptySplitFormulairePublicApi } from "./emptySplitFormulairePublicApi.ts";

export const formApi = emptySplitFormulairePublicApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicForm: builder.query<IPublicFormDTO, string>({
      query: (formKey) => ({
        url: `forms/key/${formKey}`,
        method: QueryMethod.GET,
      }),
      providesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.public.error.formService.get", err);
          toast.error(t("formulaire.public.error.formService.get"));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetPublicFormQuery } = formApi;
