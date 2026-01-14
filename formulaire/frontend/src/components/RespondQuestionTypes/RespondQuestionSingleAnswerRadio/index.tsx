import { Box, FormControl, FormControlLabel, Radio, TextField, Typography } from "@cgi-learning-hub/ui";
import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { IResponse } from "~/core/models/response/type";
import { useResponse } from "~/providers/ResponseProvider";
import { ChoiceImage } from "../style";
import { IRespondQuestionTypesProps } from "../types";
import { choiceBoxStyle, ChoicesRadioGroup, customAnswerStyle, formControlLabelStyle, labelStyle } from "./style";

export const RespondQuestionSingleAnswerRadio: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponse, getQuestionResponses, updateQuestionResponses } = useResponse();
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
  }, [question, getQuestionResponse]);

  const hasOneChoiceWithImage = useMemo(() => {
    return question.choices?.some((choice) => choice.image) ?? false;
  }, [question.choices]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
      <FormControl>
        <ChoicesRadioGroup
          hasOneChoiceWithImage={hasOneChoiceWithImage}
          value={selectedValue || ""}
          onChange={handleChange}
        >
          {question.choices
            ?.sort((a, b) => a.position - b.position)
            .map((choice) => (
              <Box key={choice.id} sx={choiceBoxStyle}>
                <FormControlLabel
                  value={choice.value}
                  sx={formControlLabelStyle}
                  control={<Radio />}
                  label={
                    <Box sx={customAnswerStyle}>
                      <Box sx={labelStyle}>
                        <Typography>{choice.value}</Typography>
                        {choice.isCustom && (
                          <>
                            <Typography>:</Typography>
                            <TextField
                              variant="standard"
                              value={customAnswer}
                              placeholder={t("formulaire.response.custom.write")}
                              onChange={handleCustomResponseChange}
                            ></TextField>
                          </>
                        )}
                      </Box>
                      {choice.image && <ChoiceImage src={choice.image} alt={choice.value} />}
                    </Box>
                  }
                />
              </Box>
            ))}
        </ChoicesRadioGroup>
      </FormControl>
    </Box>
  );
};
