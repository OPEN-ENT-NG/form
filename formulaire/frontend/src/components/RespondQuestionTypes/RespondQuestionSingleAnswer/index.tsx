import { FormControl, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FORMULAIRE } from "~/core/constants";
import { ResponsePageType } from "~/core/enums";
import { IResponse } from "~/core/models/response/type";
import { CSS_TEXT_PRIMARY_COLOR } from "~/core/style/cssColors";
import { useResponse } from "~/providers/ResponseProvider";

import { IRespondQuestionTypesProps } from "../types";

export const RespondQuestionSingleAnswer: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponses, updateQuestionResponses, pageType } = useResponse();
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [customAnswer, setCustomAnswer] = useState<string>("");
  const { t } = useTranslation(FORMULAIRE);
  const isPageTypeRecap = pageType === ResponsePageType.RECAP;

  useEffect(() => {
    const associatedResponses = getQuestionResponses(question);

    const selectedResponse = associatedResponses.find((response) => response.selected);

    // Si choice associé au choiceId isCutom alors on save/display dans tous les cas
    // Si c'est un choice classique alors on fait comme avant

    const existingAnswer = selectedResponse?.answer ?? "";
    if (typeof existingAnswer === "string") {
      setSelectedValue(existingAnswer);
    }
    const customChoice = question.choices?.find((choice) => choice.isCustom);
    if (!customChoice) return;
    const customResponse = associatedResponses.find((response) => response.choiceId === customChoice.id);
    if (customResponse) {
      setSelectedValue(customChoice.value);
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

  return isPageTypeRecap && !selectedValue ? (
    <Typography fontStyle={"italic"}>{t("formulaire.response.missing")}</Typography>
  ) : (
    <>
      <FormControl fullWidth>
        <Select
          value={selectedValue}
          onChange={handleChange}
          disabled={isPageTypeRecap}
          sx={{ "& .Mui-disabled": { WebkitTextFillColor: CSS_TEXT_PRIMARY_COLOR } }}
        >
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
          <Stack direction={isPageTypeRecap ? "row" : "column"} gap={1}>
            <Typography sx={{ py: "1rem" }}>
              {t(isPageTypeRecap ? "formulaire.response.custom.value" : "formulaire.response.custom.explanation")}
            </Typography>
            <TextField
              variant="standard"
              value={isPageTypeRecap && !customAnswer ? t("formulaire.response.missing") : customAnswer}
              placeholder={t("formulaire.response.custom.write")}
              onChange={handleCustomResponseChange}
              disabled={isPageTypeRecap}
              sx={{
                ...(isPageTypeRecap && {
                  "& .Mui-disabled": { WebkitTextFillColor: CSS_TEXT_PRIMARY_COLOR },
                  ...(!customAnswer && { fontStyle: "italic" }),
                }),
              }}
            />
          </Stack>
        )}
      </FormControl>
    </>
  );
};
