import { Typography } from "@mui/material";

import { CursorTextFieldType } from "~/components/CursorTextField/enums";
import { IQuestion, IQuestionSpecificFields } from "~/core/models/question/types";
import { t } from "~/i18n";

import { CursorProp } from "./enums";
import { cursorValueNameStyle } from "./style";

export const initDefaultSpecificFields = (question: IQuestion): IQuestionSpecificFields => {
  return {
    id: null,
    questionId: question.id,
    cursorMinVal: question.specificFields?.cursorMinVal ?? 1,
    cursorMinLabel: question.specificFields?.cursorMinLabel ?? "",
    cursorMaxVal: question.specificFields?.cursorMaxVal ?? 10,
    cursorMaxLabel: question.specificFields?.cursorMaxLabel ?? "",
    cursorStep: question.specificFields?.cursorStep ?? 1,
  };
};

export const getLabel = (mainText: string) => {
  return (
    <Typography sx={cursorValueNameStyle}>
      {mainText}
      <span style={{ color: "red" }}>&ensp;*&ensp;</span>:
    </Typography>
  );
};

export const useGetCursorTextFieldProps = (currentQuestionSpecificFields: IQuestionSpecificFields) => {
  return [
    [
      {
        text: getLabel(t("formulaire.question.value.minimum")),
        inputType: CursorTextFieldType.NUMBER,
        specificFieldsPropName: CursorProp.CURSOR_MIN_VAL,
        inputValue: currentQuestionSpecificFields.cursorMinVal,
        stepValue: currentQuestionSpecificFields.cursorStep,
      },
      {
        text: <Typography sx={cursorValueNameStyle}>{t("formulaire.question.value.label")}</Typography>,
        inputType: CursorTextFieldType.STRING,
        specificFieldsPropName: CursorProp.CURSOR_MIN_LABEL,
        inputValue: currentQuestionSpecificFields.cursorMinLabel,
      },
    ],
    [
      {
        text: getLabel(t("formulaire.question.value.maximum")),
        inputType: CursorTextFieldType.NUMBER,
        specificFieldsPropName: CursorProp.CURSOR_MAX_VAL,
        inputValue: currentQuestionSpecificFields.cursorMaxVal,
        stepValue: currentQuestionSpecificFields.cursorStep,
      },
      {
        text: <Typography sx={cursorValueNameStyle}>{t("formulaire.question.value.label")}</Typography>,
        inputType: CursorTextFieldType.STRING,
        specificFieldsPropName: CursorProp.CURSOR_MAX_LABEL,
        inputValue: currentQuestionSpecificFields.cursorMaxLabel,
      },
    ],
    [
      {
        text: getLabel(t("formulaire.question.value.step")),
        inputType: CursorTextFieldType.NUMBER,
        specificFieldsPropName: CursorProp.CURSOR_STEP,
        inputValue: currentQuestionSpecificFields.cursorStep,
        stepValue: currentQuestionSpecificFields.cursorStep,
      },
    ],
  ];
};
