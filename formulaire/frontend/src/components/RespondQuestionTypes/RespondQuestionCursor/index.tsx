import { Box, Typography } from "@cgi-learning-hub/ui";
import { Slider, Stack } from "@mui/material";
import { t } from "i18next";
import { FC, useEffect, useState } from "react";

import { ResponsePageType } from "~/core/enums";
import { useResponse } from "~/providers/ResponseProvider";

import { IRespondQuestionTypesProps } from "../types";
import { respondQuestionCursorStyle } from "./style";

export const RespondQuestionCursor: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponse, updateQuestionResponses, pageType } = useResponse();
  const [value, setValue] = useState<number | null>(null);
  const { cursorMinVal, cursorMaxVal } = question.specificFields ?? {};
  const isPageTypeRecap = pageType === ResponsePageType.RECAP;

  const marks = [
    cursorMinVal != null && { value: cursorMinVal, label: cursorMinVal },
    cursorMaxVal != null && { value: cursorMaxVal, label: cursorMaxVal },
  ].filter((mark): mark is { value: number; label: number } => Boolean(mark));

  useEffect(() => {
    const associatedResponse = getQuestionResponse(question);
    if (!associatedResponse) return;

    const currentValue = associatedResponse.answer;
    if (typeof currentValue === "number") setValue(currentValue);
  }, [question, getQuestionResponse]);

  const handleChange = (_: Event, newValue: number | number[]) => {
    const associatedResponse = getQuestionResponse(question);
    if (!question.id || !associatedResponse) return;

    const numericValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setValue(numericValue);

    associatedResponse.answer = numericValue;
    updateQuestionResponses(question, [associatedResponse]);
  };

  return isPageTypeRecap ? (
    <Stack direction="row" gap={1}>
      <Typography>{t("formulaire.selected.value")}</Typography>
      <Typography>{}</Typography> //TODO
    </Stack>
  ) : (
    <Box sx={respondQuestionCursorStyle}>
      {question.specificFields?.cursorMinLabel && <Typography>{question.specificFields.cursorMinLabel}</Typography>}
      <Slider
        value={value ?? cursorMinVal}
        onChange={handleChange}
        valueLabelDisplay="on"
        min={cursorMinVal}
        max={cursorMaxVal}
        step={question.specificFields?.cursorStep || 1}
        marks={marks}
      />
      {question.specificFields?.cursorMaxLabel && <Typography>{question.specificFields.cursorMaxLabel}</Typography>}
    </Box>
  );
};
