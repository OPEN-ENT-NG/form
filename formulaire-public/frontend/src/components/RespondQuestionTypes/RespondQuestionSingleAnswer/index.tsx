import { Box } from "@cgi-learning-hub/ui";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FORMULAIRE_PUBLIC } from "~/core/constants";
import { useResponse } from "~/providers/ResponseProvider";

import { IRespondQuestionTypesProps } from "../types";

export const RespondQuestionSingleAnswer: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponse, updateQuestionResponses } = useResponse();
  const [selectedValue, setSelectedValue] = useState<string>("");
  const { t } = useTranslation(FORMULAIRE_PUBLIC);

  useEffect(() => {
    const associatedResponse = getQuestionResponse(question);
    if (!associatedResponse) return;

    const existingAnswer = associatedResponse.answer;
    if (typeof existingAnswer === "string") {
      setSelectedValue(existingAnswer);
    }
  }, [question, getQuestionResponse]);

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectedValue(value);

    const associatedResponse = getQuestionResponse(question);
    if (!question.id || !associatedResponse) return;

    associatedResponse.answer = value;
    updateQuestionResponses(question, [associatedResponse]);
  };

  return (
    <Box>
      <FormControl fullWidth>
        <Select value={selectedValue} onChange={handleChange}>
          <MenuItem value="">{t("formulaire.options.select")}</MenuItem>
          {question.choices
            ?.sort((a, b) => a.position - b.position)
            .map((choice) => (
              <MenuItem key={choice.id} value={choice.value}>
                {choice.value}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
};
