import { FC, useEffect, useState } from "react";
import { Box, Button } from "@cgi-learning-hub/ui";
import { responseLayoutStyle, StyledButtonsWrapper } from "./style";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant } from "~/core/style/themeProps";
import { useResponse } from "~/providers/ResponseProvider";
import { IFormElement } from "~/core/models/formElement/types";
import { ProgressBar } from "~/components/ProgressBar";
import { getNextPositionIfValid } from "./utils";
import { toast } from "react-toastify";

export const ResponseLayout: FC = () => {
  const { form, formElementsList, progress, updateProgress, saveResponse, responsesMap } = useResponse();
  const { t } = useTranslation(FORMULAIRE);
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

    await saveResponse();
    setCurrentElement(prevElement);
    updateProgress(prevElement, progress.historicFormElementIds.slice(0, -1));
  };

  const goNextElement = async () => {
    //TODO gérer comme en angular (selon conditional etc.)
    if (!currentElement.position) return;
    const nextPosition = getNextPositionIfValid(currentElement, responsesMap, formElementsList);
    if (nextPosition === undefined) {
      toast.error(t("formulaire.response.next.invalid"));
    }

    const nextElement = formElementsList.find((fe) => fe.position === nextPosition);
    if (!nextElement || !nextElement.id) return;

    await saveResponse();
    setCurrentElement(nextElement);
    updateProgress(nextElement, progress.historicFormElementIds.concat([nextElement.id]));
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
      <Box>{currentElement.title} //TODO response card component here</Box>
      <StyledButtonsWrapper isFirstElement={isFirstElement} isLastElement={isLastElement}>
        {!isFirstElement && (
          <Button
            variant={ComponentVariant.OUTLINED}
            onClick={() => {
              void goPreviousElement();
            }}
          >
            {t("formulaire.prev")}
          </Button>
        )}
        {!isLastElement && (
          <Button
            variant={ComponentVariant.CONTAINED}
            onClick={() => {
              void goNextElement();
            }}
          >
            {t("formulaire.next")}
          </Button>
        )}
      </StyledButtonsWrapper>
    </Box>
  );
};
