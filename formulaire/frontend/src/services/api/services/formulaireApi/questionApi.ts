import { QueryMethod, TagName } from "~/core/enums";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi";
import { t } from "~/i18n";
import { toast } from "react-toastify";
import { IQuestion, IQuestionType } from "~/core/models/question/types";
import { FormElementType } from "~/core/models/formElement/enum";
import { buildQuestionPayload } from "~/core/models/question/utils";

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
      providesTags: [TagName.QUESTIONS, TagName.FORM_ELEMENTS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.error.questionService.list"), err);
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
          console.error(t("formulaire.error.questionTypeService.list"), err);
          toast.error(t("formulaire.error.questionTypeService.list"));
        }
      },
    }),
    createSingleQuestion: builder.mutation<IQuestion, IQuestion>({
      query: (question) => ({
        url: `forms/${question.formId}/questions`,
        method: QueryMethod.POST,
        body: [buildQuestionPayload(question)],
      }),
      invalidatesTags: [TagName.QUESTIONS, TagName.FORM_ELEMENTS],
      transformResponse: (response: IQuestion[]) => response[0],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.error.questionService.create"), err);
          toast.error(t("formulaire.error.questionService.create"));
        }
      },
    }),
    createQuestions: builder.mutation<IQuestion[], IQuestion[]>({
      query: (questions) => ({
        url: `forms/${questions[0].formId}/questions`,
        method: QueryMethod.POST,
        body: questions.map((question) => buildQuestionPayload(question)),
      }),
      invalidatesTags: [TagName.QUESTIONS, TagName.FORM_ELEMENTS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.error.questionService.create"), err);
          toast.error(t("formulaire.error.questionService.create"));
        }
      },
    }),
    updateQuestions: builder.mutation<IQuestion[], IQuestion[]>({
      query: (questions) => ({
        url: `forms/${questions[0].formId}/questions`,
        method: QueryMethod.PUT,
        body: questions.map((question) => buildQuestionPayload(question)),
      }),
      invalidatesTags: [TagName.QUESTIONS, TagName.FORM_ELEMENTS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.error.questionService.update"), err);
          toast.error(t("formulaire.error.questionService.update"));
        }
      },
    }),
    deleteSingleQuestion: builder.mutation<void, number>({
      query: (questionId) => ({
        url: `/questions/${questionId.toString()}`,
        method: QueryMethod.DELETE,
      }),
      invalidatesTags: [TagName.QUESTIONS, TagName.FORM_ELEMENTS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(t("formulaire.success.element.delete"));
        } catch (err) {
          console.error(t("formulaire.error.questionService.delete"), err);
          toast.error(t("formulaire.error.questionService.delete"));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetQuestionsQuery,
  useGetQuestionTypesQuery,
  useCreateSingleQuestionMutation,
  useCreateQuestionsMutation,
  useUpdateQuestionsMutation,
  useDeleteSingleQuestionMutation,
} = questionApi;
