import { QueryMethod, TagName } from "~/core/enums";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi";
import { t } from "~/i18n";
import { toast } from "react-toastify";
import { IQuestionChoice, IQuestionChoiceDTO } from "~/core/models/question/types";
import { buildQuestionChoicePayload, transformQuestionChoices } from "~/core/models/question/utils";

export const questionChoiceApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionChoices: builder.query<IQuestionChoice[], { questionIds: number[] }>({
      query: ({ questionIds }) => {
        const params = questionIds.reduce<Record<string, number>>((acc, item, index) => {
          acc[index] = item;
          return acc;
        }, {});
        return {
          url: `questions/choices/all`,
          method: QueryMethod.GET,
          params,
          headers: {
            Accept: "application/json;version=2.0",
          },
        };
      },
      providesTags: [TagName.QUESTIONS, TagName.CHOICE],
      transformResponse: (rawDatas: IQuestionChoiceDTO[]) => transformQuestionChoices(rawDatas),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.error.questionChoiceService.get"), err);
          toast.error(t("formulaire.error.questionChoiceService.get"));
        }
      },
    }),
    updateMultipleChoiceQuestions: builder.mutation<
      IQuestionChoice[],
      { questionChoices: IQuestionChoice[]; formId: string }
    >({
      query: ({ questionChoices, formId }) => ({
        url: `${formId}/choices`,
        method: QueryMethod.PUT,
        body: questionChoices.map((choice) => buildQuestionChoicePayload(choice)),
      }),
      invalidatesTags: [TagName.QUESTIONS, TagName.CHOICE],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.error.questionChoiceService.update"), err);
          toast.error(t("formulaire.error.questionChoiceService.update"));
        }
      },
    }),
    createMultipleChoiceQuestions: builder.mutation<
      IQuestionChoice[],
      { questionChoices: IQuestionChoice[]; formId: string }
    >({
      query: ({ questionChoices, formId }) => ({
        url: `${formId}/choices`,
        method: QueryMethod.POST,
        body: questionChoices.map((choice) => buildQuestionChoicePayload(choice)),
      }),
      invalidatesTags: [TagName.QUESTIONS, TagName.CHOICE],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.error.questionChoiceService.create"), err);
          toast.error(t("formulaire.error.questionChoiceService.create"));
        }
      },
    }),
    deleteQuestionChoice: builder.mutation<void, number>({
      query: (choiceId) => ({
        url: `choices/${choiceId}`,
        method: QueryMethod.DELETE,
      }),
      invalidatesTags: [TagName.QUESTIONS, TagName.CHOICE],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.error.questionChoiceService.delete"), err);
          toast.error(t("formulaire.error.questionChoiceService.delete"));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetQuestionChoicesQuery,
  useUpdateMultipleChoiceQuestionsMutation,
  useCreateMultipleChoiceQuestionsMutation,
  useDeleteQuestionChoiceMutation,
} = questionChoiceApi;
