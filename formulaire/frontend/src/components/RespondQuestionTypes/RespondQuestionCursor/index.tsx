import { Box } from "@cgi-learning-hub/ui";
import { Slider, Typography } from "@mui/material";
import { FC } from "react";
import { IRespondQuestionTypesProps } from "../types";
import { respondQuestionCursorStyle } from "./style";

export const RespondQuestionCursor: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { cursorMinVal, cursorMaxVal } = question.specificFields ?? {};

  const marks = [
    cursorMinVal != null && { value: cursorMinVal, label: cursorMinVal },
    cursorMaxVal != null && { value: cursorMaxVal, label: cursorMaxVal },
  ].filter((mark): mark is { value: number; label: number } => Boolean(mark));

  return (
    <Box sx={respondQuestionCursorStyle}>
      {question.specificFields?.cursorMinLabel && <Typography>{question.specificFields.cursorMinLabel}</Typography>}
      <Slider
        valueLabelDisplay="on"
        min={cursorMinVal}
        max={cursorMaxVal}
        marks={marks}
        step={question.specificFields?.cursorStep || 1}
      />
      {question.specificFields?.cursorMaxLabel && <Typography>{question.specificFields.cursorMaxLabel}</Typography>}
    </Box>
  );
};
