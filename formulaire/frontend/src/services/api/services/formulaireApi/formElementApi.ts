import { QueryMethod, TagName } from "~/core/enums";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi";
import { toast } from "react-toastify";
import { t } from "~/i18n";
import { IFormElement } from "~/core/models/formElement/types";
import { buildQuestionPayload, isFormElementQuestion } from "~/core/models/question/utils";
import { IQuestion } from "~/core/models/question/types";
import { buildSectionPayload } from "~/core/models/section/utils";
import { ISection } from "~/core/models/section/types";

export const formElementApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    updateFormElements: builder.mutation<IFormElement[], IFormElement[]>({
      query: (formElements) => ({
        url: `forms/${formElements[0].formId}/elements`,
        method: QueryMethod.PUT,
        body: formElements.map((formElement) => {
          if (isFormElementQuestion(formElement)) {
            return buildQuestionPayload(formElement as IQuestion);
          }
          return buildSectionPayload(formElement as ISection);
        }),
      }),
      invalidatesTags: [TagName.FORM_ELEMENTS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(t("formulaire.error.formElementService.update"), err);
          toast.error(t("formulaire.error.formElementService.update"));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useUpdateFormElementsMutation } = formElementApi;
