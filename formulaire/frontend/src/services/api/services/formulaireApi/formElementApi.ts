import { toast } from "react-toastify";

import { QueryMethod, TagName } from "~/core/enums";
import { IFormElement } from "~/core/models/formElement/types";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { buildQuestionPayload } from "~/core/models/question/utils";
import { buildSectionPayload } from "~/core/models/section/utils";
import { t } from "~/i18n";

import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi";

export const formElementApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    updateFormElements: builder.mutation<IFormElement[], IFormElement[]>({
      query: (formElements) => ({
        url: `forms/${formElements[0].formId}/elements`,
        method: QueryMethod.PUT,
        body: formElements.map((formElement) => {
          if (isQuestion(formElement)) return buildQuestionPayload(formElement);
          if (isSection(formElement)) return buildSectionPayload(formElement);
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
