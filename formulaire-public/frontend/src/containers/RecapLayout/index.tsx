import { Box, Button, Stack } from "@cgi-learning-hub/ui";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ResponsePageType } from "~/core/enums";
import { IFormElement } from "~/core/models/formElement/types";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { flexEndBoxStyle } from "~/core/style/boxStyles";
import { ComponentVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useResponse } from "~/providers/ResponseProvider";
import { buildProgressObject } from "~/providers/ResponseProvider/progressBarUtils";

import { RespondQuestionWrapper } from "../RespondQuestionWrapper";
import { RespondSectionWrapper } from "../RespondSectionWrapper";
import { checkMandatoryQuestions, getResponses } from "./utils";

export const RecapLayout: FC = () => {
  const { formElementsList, responsesMap, progress, setProgress, setPageType, flattenResponses, setFlattenResponses } =
    useResponse();
  const [answeredFormElements, setAnsweredFormElements] = useState<IFormElement[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setFlattenResponses(getResponses(formElementsList, responsesMap));
  }, [formElementsList, responsesMap]);

  useEffect(() => {
    const sortedFormElementsToDisplay = [...formElementsList]
      .filter((fe) => fe.id && progress.historicFormElementIds.includes(fe.id))
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    const sortedFormElementsToDisplayIds = sortedFormElementsToDisplay.map((fe) => fe.id).filter((id) => id != null);

    const newProgress = buildProgressObject(sortedFormElementsToDisplayIds, 0);
    setProgress(newProgress);
    setAnsweredFormElements(sortedFormElementsToDisplay);
  }, [formElementsList, progress]);

  const handleFinishForm = () => {
    if (!flattenResponses.length) return;

    if (!checkMandatoryQuestions(answeredFormElements, flattenResponses)) {
      toast.error(t("formulaire.public.warning.send.missing.responses.missing"));
      return;
    }

    setPageType(ResponsePageType.CAPTCHA);
  };

  return (
    <Stack gap={2} width="80%" mx="auto">
      {answeredFormElements.map((formElement) => (
        <Box key={formElement.id}>
          {isQuestion(formElement) && <RespondQuestionWrapper question={formElement} />}
          {isSection(formElement) && <RespondSectionWrapper section={formElement} />}
        </Box>
      ))}
      <Box sx={flexEndBoxStyle}>
        <Button variant={ComponentVariant.CONTAINED} onClick={handleFinishForm}>
          {t("formulaire.public.end")}
        </Button>
      </Box>
    </Stack>
  );
};
