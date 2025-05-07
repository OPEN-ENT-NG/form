import { QueryMethod, TagName } from "~/core/enums";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi";
import { FORMULAIRE } from "~/core/constants";
import i18n from "~/i18n";
import { toast } from "react-toastify";
import { IQuestion } from "~/core/models/question/types";

export const questionApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query<IQuestion[], { formId: string }>({
      query: ({ formId }) => ({
        url: `forms/${formId}/questions/all`,
        method: QueryMethod.GET,
        headers: {
          Accept: "application/json;version=2.0",
        },
      }),
      providesTags: [TagName.FORMS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.questionService.list", err);
          toast.error(i18n.t("formulaire.error.questionService.list", { ns: FORMULAIRE }));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetQuestionsQuery } = questionApi;
