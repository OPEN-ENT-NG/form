import { QueryMethod, TagName } from "~/core/enums";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi";
import { t } from "~/i18n";
import { toast } from "react-toastify";
import { IQuestion, IQuestionType } from "~/core/models/question/types";
import { FormElementType } from "~/core/models/formElement/enum";

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
      transformResponse: (response: IQuestion[]) =>
        response.map((question) => ({
          ...question,
          formElementType: FormElementType.QUESTION,
        })),
      providesTags: [TagName.QUESTIONS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.questionService.list", err);
          toast.error(t("formulaire.error.questionService.list"));
        }
      },
    }),
    getQuestionTypes: builder.query<IQuestionType[], void>({
      query: () => ({
        url: "/types",
        method: QueryMethod.GET,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.questionService.list", err);
          toast.error(t("formulaire.error.questionService.list"));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetQuestionsQuery, useGetQuestionTypesQuery } = questionApi;
