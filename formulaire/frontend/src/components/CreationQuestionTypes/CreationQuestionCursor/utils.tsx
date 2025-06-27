import { Typography } from "@mui/material";
import { IQuestion, IQuestionSpecificFields } from "~/core/models/question/types";
import { cursorValueNameStyle } from "./style";

export const initDefaultSpecificFields = (question: IQuestion): IQuestionSpecificFields => {
  if (!question.id) throw new Error("Prop question.id shouldn't be null");

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
