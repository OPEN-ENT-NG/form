import { QueryMethod, TagName } from "~/core/enums.ts";
import { IPublicFormDTO } from "~/core/models/form/types.ts";
import { handleGetFormError } from "~/core/utils.ts";

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
          handleGetFormError(err, "formulaire.public.error.formService.get");
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetPublicFormQuery } = formApi;
