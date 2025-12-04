import { FC } from "react";
import { Box, Button } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant } from "~/core/style/themeProps";
import { useGlobal } from "~/providers/GlobalProvider";
import { ModalType } from "~/core/enums";
import { useCreation } from "~/providers/CreationProvider";
import { CreationQuestionWrapper } from "../CreationQuestionWrapper";
import { actionButtonStyle, elementListStyle, innerContainerStyle, outerContainerStyle } from "./style";
import { CreationSectionWrapper } from "../CreationSectionWrapper";
import { hasFormResponses } from "~/core/models/form/utils";
import { isQuestion, isSection } from "~/core/models/formElement/utils";

export const CreationMainLayout: FC = () => {
  const { form, formElementsList } = useCreation();
  const { t } = useTranslation(FORMULAIRE);
  const { toggleModal } = useGlobal();

  const handleNewFormElement = () => {
    toggleModal(ModalType.FORM_ELEMENT_CREATE);
  };

  return (
    <Box sx={outerContainerStyle}>
      <Box sx={innerContainerStyle}>
        <Box sx={elementListStyle}>
          {formElementsList.map((element) => {
            if (isQuestion(element)) return <CreationQuestionWrapper key={element.id} question={element} />;
            if (isSection(element)) return <CreationSectionWrapper key={element.id} section={element} />;
          })}
        </Box>
        <Box sx={actionButtonStyle}>
          <Button
            variant={ComponentVariant.CONTAINED}
            onClick={handleNewFormElement}
            disabled={!!form && hasFormResponses(form)}
          >
            {t("formulaire.add.element")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
