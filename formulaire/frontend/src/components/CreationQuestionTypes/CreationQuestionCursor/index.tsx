import { FC, useEffect, useState } from "react";
import { ICreationQuestionTypesProps } from "../types";
import { Box, TextField, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { cursorItemStyle, cursorLineStyle, cursorPropsStyle, cursorValueNameStyle } from "./style";
import { ComponentSize, ComponentVariant } from "~/core/style/themeProps";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";
import { IQuestionSpecificFields } from "~/core/models/question/types";
import { getLabel, initDefaultSpecificFields } from "./utils";
import { CursorTextField } from "~/components/CursorTextField";
import { CursorTextFieldType } from "~/components/CursorTextField/enums";
import { CursorProp } from "./enums";

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
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>, cursorProp: CursorProp) => {
    console.log("handleValueCahnge : " + event.target.value);

    const updatedSpecificFields = {
      ...currentQuestionCursorProps,
      [cursorProp]: event.target.value,
    };
    setCurrentQuestionCursorProps(updatedSpecificFields);
    // someting to do here ?
  };

  return (
    <Box sx={cursorPropsStyle}>
      {/* Min value and label */}
      <Box sx={cursorLineStyle}>
        <Box sx={cursorItemStyle}>
          {getLabel(t("formulaire.question.value.minimum"))}
          <CursorTextField
            type={CursorTextFieldType.NUMBER}
            isCurrentEditingElement={isCurrentEditingElement(question, currentEditingElement)}
            onChangeCallback={(event) => {
              handleValueChange(event, CursorProp.CURSOR_MAX_VAL);
            }}
            inputValue={currentQuestionCursorProps.cursorMinVal}
            stepValue={currentQuestionCursorProps.cursorStep}
          ></CursorTextField>
        </Box>
        <Box sx={cursorItemStyle}>
          <Typography sx={cursorValueNameStyle}>{t("formulaire.question.value.label")}</Typography>
          <CursorTextField
            type={CursorTextFieldType.STRING}
            isCurrentEditingElement={isCurrentEditingElement(question, currentEditingElement)}
            onChangeCallback={(event) => {
              handleValueChange(event, CursorProp.CURSOR_MAX_LABEL);
            }}
            inputValue={currentQuestionCursorProps.cursorMinLabel}
          ></CursorTextField>
        </Box>
      </Box>
      {/* Max value and label */}
      <Box sx={cursorLineStyle}>
        <Box sx={cursorItemStyle}>
          {getLabel(t("formulaire.question.value.maximum"))}
          <CursorTextField
            type={CursorTextFieldType.NUMBER}
            isCurrentEditingElement={isCurrentEditingElement(question, currentEditingElement)}
            onChangeCallback={(event) => {
              handleValueChange(event, CursorProp.CURSOR_MIN_VAL);
            }}
            inputValue={currentQuestionCursorProps.cursorMaxVal}
            stepValue={currentQuestionCursorProps.cursorStep}
          ></CursorTextField>
        </Box>
        <Box sx={cursorItemStyle}>
          <Typography sx={cursorValueNameStyle}>{t("formulaire.question.value.label")}</Typography>
          <CursorTextField
            type={CursorTextFieldType.STRING}
            isCurrentEditingElement={isCurrentEditingElement(question, currentEditingElement)}
            onChangeCallback={(event) => {
              handleValueChange(event, CursorProp.CURSOR_MIN_LABEL);
            }}
            inputValue={currentQuestionCursorProps.cursorMaxLabel}
          ></CursorTextField>
        </Box>
      </Box>
      {/* Step value */}
      <Box sx={cursorLineStyle}>
        <Box sx={cursorItemStyle}>
          {getLabel(t("formulaire.question.value.step"))}
          <CursorTextField
            type={CursorTextFieldType.NUMBER}
            isCurrentEditingElement={isCurrentEditingElement(question, currentEditingElement)}
            onChangeCallback={(event) => {
              handleValueChange(event, CursorProp.CURSOR_STEP);
            }}
            inputValue={currentQuestionCursorProps.cursorStep}
            stepValue={currentQuestionCursorProps.cursorStep}
          ></CursorTextField>
        </Box>
      </Box>
    </Box>
  );
};
