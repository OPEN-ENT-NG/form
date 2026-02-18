import { Box, Button } from "@cgi-learning-hub/ui";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ProgressBar } from "~/components/ProgressBar";
import { ResponsePageType } from "~/core/enums";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { ComponentVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useResponse } from "~/providers/ResponseProvider";

import { RespondQuestionWrapper } from "../RespondQuestionWrapper";
import { RespondSectionWrapper } from "../RespondSectionWrapper";
import { responseLayoutStyle, StyledButtonsWrapper } from "./style";
import { getNextPositionIfValid, saveResponses } from "./utils";

export const ResponseLayout: FC = () => {
  const {
    form,
    formElementsList,
    progress,
    updateProgress,
    setPageType,
    currentElement,
    setCurrentElement,
    getQuestionResponses,
    responsesMap,
    scrollToQuestionId,
  } = useResponse();
  const [isFirstElement, setIsFirstElement] = useState<boolean>(false);
  const [isLastElement, setIsLastElement] = useState<boolean>(false);

  useEffect(() => {
    if (formElementsList.length > 0 && !currentElement) {
      setCurrentElement(formElementsList[0]);
    }
  }, [formElementsList]);

  useEffect(() => {
    if (currentElement?.position) {
      setIsFirstElement(currentElement.position === 1);
      setIsLastElement(currentElement.position === formElementsList.length);

      // Scroll when arriving from recap page
      if (!scrollToQuestionId) {
        window.scrollTo({ top: 0 });
        return;
      }
      requestAnimationFrame(() => {
        const el = document.getElementById(`question-${scrollToQuestionId}`);
        el?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [currentElement, scrollToQuestionId]);

  const goPreviousElement = () => {
    if (!currentElement) return;
    const prevId = progress.historicFormElementIds[progress.historicFormElementIds.length - 2];
    const prevElement = formElementsList.find((fe) => fe.id === prevId);

    if (!prevElement) return;

    saveResponses(progress, responsesMap);
    setCurrentElement(prevElement);
    updateProgress(prevElement, progress.historicFormElementIds.slice(0, -1));
  };

  const goNextElement = () => {
    if (!currentElement?.position) return;
    const nextPosition = getNextPositionIfValid(currentElement, formElementsList, getQuestionResponses);

    // An error occured
    if (nextPosition === undefined) {
      toast.error(t("formulaire.public.response.next.invalid"));
      return;
    }

    // It's the end of the form
    if (nextPosition === null || (nextPosition && nextPosition > formElementsList.length)) {
      saveResponses(progress, responsesMap);
      if (form?.id) setPageType(ResponsePageType.RECAP);
      return;
    }

    // We got an element for the next position
    saveResponses(progress, responsesMap);

    const nextElement = formElementsList.find((fe) => fe.position === nextPosition);
    if (!nextElement || !nextElement.id) return;

    setCurrentElement(nextElement);
    updateProgress(nextElement, progress.historicFormElementIds.concat([nextElement.id]));
  };

  const getFormElementContent = () => {
    if (!currentElement) return;
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
          <Button variant={ComponentVariant.OUTLINED} onClick={goPreviousElement}>
            {t("formulaire.public.prev")}
          </Button>
        )}
        <Button variant={ComponentVariant.CONTAINED} onClick={goNextElement}>
          {t("formulaire.public.next")}
        </Button>
      </StyledButtonsWrapper>
    </Box>
  );
};
