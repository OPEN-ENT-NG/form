import { FC, useEffect, useState } from "react";
import { ICreationQuestionTypesProps } from "../types";
import { Box, Input, TextField, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { cursorItemStyle, cursorLineStyle, cursorValueNameStyle } from "./style";
import { ComponentVariant } from "~/core/style/themeProps";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";
import { IQuestionSpecificFields } from "~/core/models/question/types";
import { getInputsSlotProps, getLabel, initDefaultSpecificFields } from "./utils";

export const CreationQuestionCursor: FC<ICreationQuestionTypesProps> = ({ question }) => {
  const { t } = useTranslation(FORMULAIRE);
  const [currentQuestionCursorProps, setCurrentQuestionCursorProps] = useState<IQuestionSpecificFields>(
    initDefaultSpecificFields(question),
  );
  const { currentEditingElement, setCurrentEditingElement } = useCreation();

  // Save question when we this component is not the edited one anymore
  useEffect(() => {
    if (!currentEditingElement || !isCurrentEditingElement(question, currentEditingElement)) {
      return;
    }
    const updatedQuestion = {
      ...question,
      specificFields: currentQuestionCursorProps,
    };

    setCurrentEditingElement(updatedQuestion);
  }, [currentQuestionCursorProps, setCurrentEditingElement]);

  // Locally save the changed value in the question's specificFields
  const handleValueChange = () => {
    const updatedSpecificFields = {
      ...currentQuestionCursorProps,
      // modified prop here
    };
    setCurrentQuestionCursorProps(updatedSpecificFields);
    // someting to do here ?
  };

  return (
    <Box>
      {/* Min value and label */}
      <Box sx={cursorLineStyle}>
        <Box sx={cursorItemStyle}>
          {getLabel(t("formulaire.question.value.minimum"))}
          <Input
            type="number"
            disabled={!isCurrentEditingElement(question, currentEditingElement)}
            slotProps={getInputsSlotProps(!isCurrentEditingElement(question, currentEditingElement))}
            // TODO call handleValueChange
          />
        </Box>
        <Box sx={cursorItemStyle}>
          <Typography sx={cursorValueNameStyle}>{t("formulaire.question.value.label")}</Typography>
          <TextField
            variant={ComponentVariant.STANDARD}
            placeholder={t("formulaire.question.label")}
            value={""}
            onChange={() => {}}
            slotProps={getInputsSlotProps(!isCurrentEditingElement(question, currentEditingElement))}
            // TODO call handleValueChange
          />
        </Box>
      </Box>
      {/* Max value and label */}
      <Box sx={cursorLineStyle}>
        <Box sx={cursorItemStyle}>
          {getLabel(t("formulaire.question.value.maximum"))}
          <Input
            type="number"
            disabled={!isCurrentEditingElement(question, currentEditingElement)}
            slotProps={getInputsSlotProps(!isCurrentEditingElement(question, currentEditingElement))}
            // TODO call handleValueChange
          />
        </Box>
        <Box sx={cursorItemStyle}>
          <Typography sx={cursorValueNameStyle}>{t("formulaire.question.value.label")}</Typography>
          <TextField
            variant={ComponentVariant.STANDARD}
            placeholder={t("formulaire.question.label")}
            value={""}
            onChange={() => {}}
            slotProps={getInputsSlotProps(!isCurrentEditingElement(question, currentEditingElement))}
            // TODO call handleValueChange
          />
        </Box>
      </Box>
      {/* Step value */}
      <Box sx={cursorLineStyle}>
        <Box sx={cursorItemStyle}>
          {getLabel(t("formulaire.question.value.step"))}
          <Input
            type="number"
            disabled={!isCurrentEditingElement(question, currentEditingElement)}
            slotProps={getInputsSlotProps(!isCurrentEditingElement(question, currentEditingElement))}
            // TODO call handleValueChange
          />
        </Box>
      </Box>
    </Box>
  );
};
