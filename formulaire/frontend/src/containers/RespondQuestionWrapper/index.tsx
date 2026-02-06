import { Box, Button, Paper, Stack, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { FORMULAIRE } from "~/core/constants";
import { ResponsePageType } from "~/core/enums";
import { DistributionStatus } from "~/core/models/distribution/enums";
import { IFormElement } from "~/core/models/formElement/types";
import { isSection } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { flexEndBoxStyle } from "~/core/style/boxStyles";
import { ERROR_MAIN_COLOR, PRIMARY, SECONDARY_MAIN_COLOR, TEXT_PRIMARY_COLOR, TEXT_SECONDARY_COLOR } from "~/core/style/colors";
import { BoxComponentType, ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { useResponse } from "~/providers/ResponseProvider";

import { mandatoryTitleStyle, questionStackStyle } from "./style";
import { IRespondQuestionWrapperProps } from "./types";
import { getRespondQuestionContentByType } from "./utils";

export const RespondQuestionWrapper: FC<IRespondQuestionWrapperProps> = ({ question }) => {
  const { form, distribution, formElementsList, pageType, setPageType, progress, updateProgress, setCurrentElement } =
    useResponse();
  const { t } = useTranslation(FORMULAIRE);
  const { navigateToFormResponse } = useFormulaireNavigation();
  const isPageTypeRecap = pageType === ResponsePageType.RECAP;

  const navigateToQuestion = () => {
    if (!form?.id || !distribution?.id) return;
    let targetElement: IFormElement | undefined = question;

    if (question.sectionId)
      targetElement = formElementsList.find((fe) => isSection(fe) && fe.id === question.sectionId);

    if (!targetElement?.id) return;
    const targetIndexInProgress = progress.historicFormElementIds.indexOf(targetElement.id);
    if (targetIndexInProgress < 0) return;
    updateProgress(targetElement, progress.historicFormElementIds.slice(0, targetIndexInProgress + 1));
    setCurrentElement(targetElement);
    setPageType(ResponsePageType.FORM_ELEMENT);
    navigateToFormResponse(form.id, distribution.id);
  };

  return (
    <Stack key={question.id} component={Paper} sx={questionStackStyle}>
      <Typography variant={TypographyVariant.H6} color={question.title ? TEXT_PRIMARY_COLOR : TEXT_SECONDARY_COLOR}>
        {question.title || t("formulaire.question.title.empty")}
        {question.mandatory && (
          <Typography component={BoxComponentType.SPAN} color={ERROR_MAIN_COLOR} sx={mandatoryTitleStyle}>
            *
          </Typography>
        )}
      </Typography>
      <Box>{getRespondQuestionContentByType(question)}</Box>
      {(form?.editable || distribution?.status != DistributionStatus.FINISHED) &&
        isPageTypeRecap &&
        question.questionType != QuestionTypes.FREETEXT && (
          <Box sx={flexEndBoxStyle}>
            <Button
              variant={ComponentVariant.TEXT}
              color={PRIMARY}
              onClick={navigateToQuestion}
              sx={{ ":hover": { background: "transparent", color: SECONDARY_MAIN_COLOR } }}
            >
              {t("formulaire.edit")}
            </Button>
          </Box>
        )}
    </Stack>
  );
};
