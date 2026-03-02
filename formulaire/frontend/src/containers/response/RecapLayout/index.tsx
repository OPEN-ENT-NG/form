import { Box, Button, Stack } from "@cgi-learning-hub/ui";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { FORMULAIRE } from "~/core/constants";
import { ModalType } from "~/core/enums";
import { DistributionStatus } from "~/core/models/distribution/enums";
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
  const { form, formElementsList, distribution, responses, progress, setProgress } = useResponse();
  const {
    displayModals: { showSendForm },
    toggleModal,
  } = useGlobal();
  const [answeredFormElements, setAnsweredFormElements] = useState<IFormElement[]>([]);
  window.scrollTo({ top: 0 });

  useEffect(() => {
    const formElementsToDisplay = getFormElementsToDisplay(formElementsList, responses);
    const sortedFormElementsToDisplay = [...formElementsToDisplay]
      .filter((fe) =>
        fe.id && progress.historicFormElementIds.length ? progress.historicFormElementIds.includes(fe.id) : true,
      )
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    setAnsweredFormElements(sortedFormElementsToDisplay);

    if (progress.historicFormElementIds.length) return;
    const sortedFormElementsToDisplayIds = sortedFormElementsToDisplay.map((fe) => fe.id).filter((id) => id != null);
    const newProgress = buildProgressObject(sortedFormElementsToDisplayIds, 0);
    setProgress(newProgress);
  }, [formElementsList, responses]);

  const saveAndQuit = () => {
    navigateToHome();
  };

  const handleSendForm = () => {
    if (!checkMandatoryQuestions(answeredFormElements, responses)) {
      toast.error(t("formulaire.warning.send.missing.responses.missing"));
      return;
    }
    toggleModal(ModalType.SEND_FORM);
  };

  return (
    <>
      <Stack gap={2} width="80%" mx="auto">
        {answeredFormElements.map((formElement) => (
          <Box key={formElement.id}>
            {isQuestion(formElement) && <RespondQuestionWrapper question={formElement} />}
            {isSection(formElement) && <RespondSectionWrapper section={formElement} />}
          </Box>
        ))}
        {!form?.editable && distribution?.status === DistributionStatus.FINISHED ? (
          <Stack direction="row" justifyContent="flex-end" gap={2} mt={4}>
            <Button variant={ComponentVariant.OUTLINED} onClick={saveAndQuit}>
              {t("formulaire.quit")}
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="flex-end" gap={2} mt={4}>
            <Button variant={ComponentVariant.OUTLINED} onClick={saveAndQuit}>
              {t("formulaire.saveAndQuit")}
            </Button>
            <Button variant={ComponentVariant.CONTAINED} onClick={handleSendForm}>
              {t("formulaire.end")}
            </Button>
          </Stack>
        )}
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
