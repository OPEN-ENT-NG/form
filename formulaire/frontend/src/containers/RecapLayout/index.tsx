import { Box, Button, Stack } from "@cgi-learning-hub/ui";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FORMULAIRE } from "~/core/constants";
import { ModalType } from "~/core/enums";
import { IFormElement } from "~/core/models/formElement/types";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { ComponentVariant } from "~/core/style/themeProps";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { useGlobal } from "~/providers/GlobalProvider";
import { useResponse } from "~/providers/ResponseProvider";
import { buildProgressObject } from "~/providers/ResponseProvider/progressBarUtils";

import { RespondQuestionWrapper } from "../RespondQuestionWrapper";
import { RespondSectionWrapper } from "../RespondSectionWrapper";
import { SendFormModal } from "../SendFormModal";
import { checkMandatoryQuestions, getFormElementsToDisplay } from "./utils";

export const RecapLayout: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const { navigateToHome } = useFormulaireNavigation();
  const { formElementsList, distribution, responses, setProgress } = useResponse();
  const {
    displayModals: { showSendForm },
    toggleModal,
  } = useGlobal();
  const [answeredFormElements, setAnsweredFormElements] = useState<IFormElement[]>([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const formElementsToDisplay = getFormElementsToDisplay(formElementsList, responses);
    const sortedFormElementsToDisplayIds = formElementsToDisplay
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((fe) => fe.id)
      .filter((id) => id != null);

    const newProgress = buildProgressObject(sortedFormElementsToDisplayIds, 0);
    setProgress(newProgress);
    setAnsweredFormElements(formElementsToDisplay);
  }, [formElementsList, responses]);

  const saveAndQuit = () => {
    navigateToHome();
  };

  const handleSendForm = () => {
    if (checkMandatoryQuestions(answeredFormElements, [])) {
      toggleModal(ModalType.SEND_FORM);
    }
  };

  return (
    <>
      <Stack>
        <Stack gap={2} width="80%" mx="auto">
          {answeredFormElements.map((formElement, index) => (
            <Box key={index}>
              {isQuestion(formElement) && <RespondQuestionWrapper question={formElement} />}
              {isSection(formElement) && <RespondSectionWrapper section={formElement} />}
            </Box>
          ))}
        </Stack>
        <Stack direction="row" justifyContent="flex-end" gap={2} mt={4}>
          <Button variant={ComponentVariant.OUTLINED} onClick={saveAndQuit}>
            {t("formulaire.saveAndQuit")}
          </Button>
          <Button variant={ComponentVariant.CONTAINED} onClick={handleSendForm}>
            {t("formulaire.end")}
          </Button>
        </Stack>
      </Stack>
      {showSendForm && distribution && (
        <SendFormModal
          isOpen={showSendForm}
          handleClose={() => {
            toggleModal(ModalType.SEND_FORM);
          }}
          distribution={distribution}
        />
      )}
    </>
  );
};
