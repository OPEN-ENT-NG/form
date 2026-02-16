import { toast } from "react-toastify";

import { QueryMethod, TagName } from "~/core/enums.ts";
import { IPublicFormDTO } from "~/core/models/form/types.ts";
import { t } from "~/i18n";

import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";

export const formApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicForm: builder.query<IPublicFormDTO, { formKey: string }>({
      query: ({ formKey }) => ({
        url: `forms/key/${formKey}`,
        method: QueryMethod.GET,
      }),
      providesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.get", err);
          toast.error(t("formulaire.error.formService.get"));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetPublicFormQuery } = formApi;
