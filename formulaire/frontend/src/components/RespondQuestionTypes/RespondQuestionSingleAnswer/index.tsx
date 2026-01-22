import { Box } from "@cgi-learning-hub/ui";
import { FormControl, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FORMULAIRE } from "~/core/constants";
import { useResponse } from "~/providers/ResponseProvider";

import { IRespondQuestionTypesProps } from "../types";
import { IResponse } from "~/core/models/response/type";

export const RespondQuestionSingleAnswer: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponses, updateQuestionResponses } = useResponse();
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [customAnswer, setCustomAnswer] = useState<string>("");
  const { t } = useTranslation(FORMULAIRE);

  useEffect(() => {
    const associatedResponses = getQuestionResponses(question);

    const selectedResponse = associatedResponses.find((response) => response.selected);

    const existingAnswer = selectedResponse?.answer ?? "";
    if (typeof existingAnswer === "string") {
      setSelectedValue(existingAnswer);
    }
    const customChoiceId = question.choices?.find((choice) => choice.isCustom)?.id;
    if (!customChoiceId) return;
    const customResponse = associatedResponses.find((response) => response.choiceId === customChoiceId);
    if (customResponse) {
      setCustomAnswer(customResponse.customAnswer ?? "");
    }
  }, [question, getQuestionResponses]);

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectedValue(value);

    const associatedResponses = getQuestionResponses(question);
    const newResponses: IResponse[] = associatedResponses.map((response) => {
      return { ...response, selected: response.answer === value };
    });

    updateQuestionResponses(question, newResponses);
  };

  const handleCustomResponseChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newCustomAnswer = e.target.value;
    const existingResponses = getQuestionResponses(question);

    const customChoiceId = question.choices?.find((choice) => choice.isCustom)?.id;
    if (!customChoiceId) return;

    const updatedReponses = existingResponses.map((response) => {
      if (response.choiceId === customChoiceId) {
        return { ...response, customAnswer: newCustomAnswer };
      }
      return response;
    });

    updateQuestionResponses(question, updatedReponses);
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
        {question.choices?.find((choice) => choice.value === selectedValue && choice.isCustom) && (
          <>
            <Typography sx={{ py: "1rem" }}>{t("formulaire.response.custom.label")} :</Typography>
            <TextField
              fullWidth
              variant="standard"
              value={customAnswer}
              placeholder={t("formulaire.response.custom.write")}
              onChange={handleCustomResponseChange}
            />
          </>
        )}
      </FormControl>
    </Box>
  );
};
