import { Box, Button } from "@cgi-learning-hub/ui";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { ProgressBar } from "~/components/ProgressBar";
import { FORMULAIRE_PUBLIC } from "~/core/constants";
import { ResponsePageType } from "~/core/enums";
import { IFormElement } from "~/core/models/formElement/types";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { ComponentVariant } from "~/core/style/themeProps";
import { useResponse } from "~/providers/ResponseProvider";

import { RespondQuestionWrapper } from "../RespondQuestionWrapper";
import { RespondSectionWrapper } from "../RespondSectionWrapper";
import { responseLayoutStyle, StyledButtonsWrapper } from "./style";
import { getNextPositionIfValid } from "./utils";

export const ResponseLayout: FC = () => {
  const {
    form,
    formElementsList,
    progress,
    updateProgress,
    saveResponses,
    responsesMap,
    isInPreviewMode,
    setPageType,
  } = useResponse();
  const { t } = useTranslation(FORMULAIRE_PUBLIC);
  const [currentElement, setCurrentElement] = useState<IFormElement>(formElementsList[0] ?? null);
  const [isFirstElement, setIsFirstElement] = useState<boolean>(false);
  const [isLastElement, setIsLastElement] = useState<boolean>(false);

  useEffect(() => {
    if (formElementsList.length > 0) {
      setCurrentElement(formElementsList[0]);
    }
  }, [formElementsList]);

  useEffect(() => {
    if (currentElement.position) {
      setIsFirstElement(currentElement.position === 1);
      setIsLastElement(currentElement.position === formElementsList.length);
    }
  }, [currentElement]);

  const goPreviousElement = async () => {
    const prevId = progress.historicFormElementIds[progress.historicFormElementIds.length - 2];
    const prevElement = formElementsList.find((fe) => fe.id === prevId);

    if (!prevElement) return;

    await saveResponses();
    setCurrentElement(prevElement);
    updateProgress(prevElement, progress.historicFormElementIds.slice(0, -1));
  };

  const goNextElement = async () => {
    if (!currentElement.position) return;
    const nextPosition = getNextPositionIfValid(currentElement, responsesMap, formElementsList);

    // An error occured
    if (nextPosition === undefined) {
      toast.error(t("formulaire.response.next.invalid"));
      return;
    }

    // It's the end of the form
    if (nextPosition && nextPosition > formElementsList.length) {
      await saveResponses();
      setPageType(isInPreviewMode ? ResponsePageType.END_PREVIEW : ResponsePageType.RECAP);
      return;
    }

    // We got an element for the next position
    //TODO check if we need that later : unloadLastResponses();
    await saveResponses();

    const nextElement = formElementsList.find((fe) => fe.position === nextPosition);
    if (!nextElement || !nextElement.id) return;

    updateProgress(nextElement, progress.historicFormElementIds.concat([nextElement.id]));
    setCurrentElement(nextElement);
  };

  const getFormElementContent = () => {
    if (isQuestion(currentElement)) return <RespondQuestionWrapper question={currentElement} />;
    if (isSection(currentElement)) return <RespondSectionWrapper section={currentElement} />;
  };

  return (
    <Box sx={responseLayoutStyle}>
      {!form?.is_progress_bar_disabled && (
        <Box sx={{ width: "100%" }}>
          <ProgressBar
            nbActiveSteps={progress.historicFormElementIds.length}
            nbRemainingSteps={progress.longuestRemainingPath}
          ></ProgressBar>
        </Box>
      )}
      {getFormElementContent()}
      <StyledButtonsWrapper isFirstElement={isFirstElement} isLastElement={isLastElement}>
        {!isFirstElement && (
          <Button
            variant={ComponentVariant.OUTLINED}
            onClick={() => {
              void goPreviousElement();
            }}
          >
            {t("formulaire.public.prev")}
          </Button>
        )}
        <Button
          variant={ComponentVariant.CONTAINED}
          onClick={() => {
            void goNextElement();
          }}
        >
          {t("formulaire.public.next")}
        </Button>
      </StyledButtonsWrapper>
    </Box>
  );
};
