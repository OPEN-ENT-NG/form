import { emptySplitApi } from "./emptySplitApi.ts";

export const formApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteForm: builder.mutation<void, number>({
      query: (formId) => ({
        url: `forms/${formId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Forms"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.formService.delete", err);
          throw new Error("formulaire.error.formService.delete");
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useDeleteFormMutation } = formApi;
