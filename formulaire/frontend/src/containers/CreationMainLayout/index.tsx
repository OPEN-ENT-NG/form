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
import { elementBoxStyle, innerContainerStyle, outerContainerStyle } from "./style";

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
      </Box>
    );
  };

  return (
    <Box sx={outerContainerStyle}>
      <Box sx={innerContainerStyle}>
        <Box>{formElementsList.map(renderFormElement)}</Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant={ComponentVariant.CONTAINED} onClick={handleNewFormElement}>
            {t("formulaire.add.element")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
