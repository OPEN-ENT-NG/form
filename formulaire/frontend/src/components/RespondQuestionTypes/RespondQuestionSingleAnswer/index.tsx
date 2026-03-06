import { FormControl, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FORMULAIRE } from "~/core/constants";
import { IResponse } from "~/core/models/response/type";
import { CSS_TEXT_PRIMARY_COLOR } from "~/core/style/cssColors";
import { useResponse } from "~/providers/ResponseProvider";

import { IRespondQuestionTypesProps } from "../types";

export const RespondQuestionSingleAnswer: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponses, updateQuestionResponses, isPageTypeRecap } = useResponse();
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | "">("");
  const [customAnswer, setCustomAnswer] = useState<string>("");
  const { t } = useTranslation(FORMULAIRE);

  useEffect(() => {
    const associatedResponses = getQuestionResponses(question);

    const selectedResponse = associatedResponses.find((response) => response.selected);
    if (!selectedResponse) return;

    const customChoice = question.choices?.find((choice) => choice.isCustom);

    if (customChoice && selectedResponse.choiceId === customChoice.id) {
      setSelectedChoiceId(customChoice.id);
      setCustomAnswer(selectedResponse.customAnswer ?? "");
      return;
    }

    setSelectedChoiceId(selectedResponse.choiceId ?? "");
  }, [question, getQuestionResponses]);

  const handleChange = (event: SelectChangeEvent<number | "">) => {
    const value = event.target.value === "" ? "" : Number(event.target.value);
    setSelectedChoiceId(value);

    const associatedResponses = getQuestionResponses(question);

    const newResponses: IResponse[] = associatedResponses.map((response) => ({
      ...response,
      selected: response.choiceId === value,
    }));

    updateQuestionResponses(question, newResponses);
  };

  const handleCustomResponseChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newCustomAnswer = e.target.value;
    setCustomAnswer(newCustomAnswer);

    const existingResponses = getQuestionResponses(question);
    const customChoiceId = question.choices?.find((choice) => choice.isCustom)?.id;

    if (!customChoiceId) return;

    const updatedResponses = existingResponses.map((response) => {
      if (response.choiceId === customChoiceId) {
        return {
          ...response,
          customAnswer: newCustomAnswer,
        };
      }
      return response;
    });

    updateQuestionResponses(question, updatedResponses);
  };

  const selectedChoice = question.choices?.find((choice) => choice.id === selectedChoiceId);

  return isPageTypeRecap && !selectedChoiceId ? (
    <Typography fontStyle={"italic"}>{t("formulaire.response.missing")}</Typography>
  ) : (
    <FormControl fullWidth>
      <Select
        value={selectedChoiceId}
        onChange={handleChange}
        disabled={isPageTypeRecap}
        sx={{ "& .Mui-disabled": { WebkitTextFillColor: CSS_TEXT_PRIMARY_COLOR } }}
      >
        <MenuItem value="">{t("formulaire.options.select")}</MenuItem>

        {question.choices
          ?.sort((a, b) => a.position - b.position)
          .map((choice) => (
            <MenuItem key={choice.id} value={choice.id ?? undefined}>
              {choice.value}
            </MenuItem>
          ))}
      </Select>

      {selectedChoice?.isCustom && (
        <Stack
          direction={isPageTypeRecap ? "row" : "column"}
          gap={1}
          {...(isPageTypeRecap && { alignItems: "center" })}
        >
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
                "& .Mui-disabled": {
                  WebkitTextFillColor: `${CSS_TEXT_PRIMARY_COLOR} !important`,
                },
                ...(!customAnswer && { fontStyle: "italic" }),
              }),
            }}
          />
        </Stack>
      )}
    </FormControl>
  );
};
