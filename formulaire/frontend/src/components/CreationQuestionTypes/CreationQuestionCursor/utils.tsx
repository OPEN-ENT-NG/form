import { Typography } from "@mui/material";
import { IQuestion, IQuestionSpecificFields } from "~/core/models/question/types";
import { cursorValueNameStyle } from "./style";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { IFormElement } from "~/core/models/formElement/types";

export const initDefaultSpecificFields = (question: IQuestion): IQuestionSpecificFields => {
  if (!question.id) throw new Error("question.id ne devrait jamais être null");

  return {
    id: null,
    questionId: question.id,
    cursorMinVal: 1,
    cursorMaxVal: 10,
    cursorStep: 1,
    cursorMinLabel: "",
    cursorMaxLabel: "",
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

export const getInputsSlotProps = (isCurrentEditingElement: boolean) => {
  return {
    input: {
      readOnly: !isCurrentEditingElement,
      sx: {
        pointerEvents: !isCurrentEditingElement ? "none" : "auto",
        userSelect: !isCurrentEditingElement ? "none" : "auto",
        caretColor: !isCurrentEditingElement ? "transparent" : "auto",
      },
    },
  };
};
