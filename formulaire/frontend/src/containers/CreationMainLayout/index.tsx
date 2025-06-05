import { FC } from "react";
import { Box, Button, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant } from "~/core/style/themeProps";
import { useModal } from "~/providers/ModalProvider";
import { ModalType } from "~/core/enums";
import { useCreation } from "~/providers/CreationProvider";
import { isFormElementQuestion } from "~/core/models/question/utils";
import { CreationQuestionWrapper } from "../CreationQuestionWrapper";
import { IQuestion } from "~/core/models/question/types";
import { IFormElement } from "~/core/models/formElement/types";
import {
  actionButtonStyle,
  elementBoxStyle,
  elementListStyle,
  innerContainerStyle,
  outerContainerStyle,
} from "./style";
import { ISection } from "~/core/models/section/types";

export const CreationMainLayout: FC = () => {
  const { formElementsList } = useCreation();
  const { t } = useTranslation(FORMULAIRE);
  const { toggleModal } = useModal();

  const handleNewFormElement = () => {
    toggleModal(ModalType.FORM_ELEMENT_CREATE);
  };

  // Helper to render each form element
  const renderFormElement = (element: IFormElement, idx: number) => {
    if (isFormElementQuestion(element)) {
      return <CreationQuestionWrapper key={idx} question={element as IQuestion} />;
    }

    return (
      <Box key={idx} sx={elementBoxStyle}>
        <Typography>
          {element.title} — position #{element.position}
        </Typography>
        {Array.isArray((element as ISection).questions) &&
          (element as ISection).questions.map((q: IQuestion, qIdx: number) => (
            <Box sx={{ marginTop: "10px" }} key={qIdx}>
              <CreationQuestionWrapper question={q} />
            </Box>
          ))}
      </Box>
    );
  };

  return (
    <Box sx={outerContainerStyle}>
      <Box sx={innerContainerStyle}>
        <Box sx={elementListStyle}>{formElementsList.map(renderFormElement)}</Box>

        <Box sx={actionButtonStyle}>
          <Button variant={ComponentVariant.CONTAINED} onClick={handleNewFormElement}>
            {t("formulaire.add.element")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
