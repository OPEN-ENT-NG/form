import { Box, Button, Stack } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { FORMULAIRE } from "~/core/constants";
import { ModalType } from "~/core/enums";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { getHomeResponsesPath } from "~/core/pathHelper";
import { ComponentVariant } from "~/core/style/themeProps";
import { useGlobal } from "~/providers/GlobalProvider";
import { useResponse } from "~/providers/ResponseProvider";

import { RespondQuestionWrapper } from "../RespondQuestionWrapper";
import { RespondSectionWrapper } from "../RespondSectionWrapper";
import { SendFormModal } from "../SendFormModal";
import { checkMandatoryQuestions } from "./utils";

export const RecapLayout: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const navigate = useNavigate();
  const { formElementsList, distribution, progress } = useResponse();
  const {
    displayModals: { showSendForm },
    toggleModal,
  } = useGlobal();

  console.log(progress);

  const saveAndQuit = () => {
    navigate(getHomeResponsesPath());
  };

  const handleSendForm = () => {
    if (checkMandatoryQuestions(formElementsList, [])) {
      toggleModal(ModalType.SEND_FORM);
    }
  };

  return (
    <>
      <Stack>
        <Stack gap={2} width="80%" mx="auto">
          {formElementsList.map((formElement, index) => (
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
