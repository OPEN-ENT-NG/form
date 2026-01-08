import { Box, Checkbox, FormControl, FormControlLabel, TextField, Typography } from "@cgi-learning-hub/ui";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { IResponse } from "~/core/models/response/type";
import { useResponse } from "~/providers/ResponseProvider";
import { IRespondQuestionTypesProps } from "../types";
import { customAnswerStyle } from "./style";

export const RespondQuestionMultipleAnswer: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponses, updateQuestionResponses } = useResponse();
  const [reponses, setResponses] = useState<IResponse[]>([]);
  const [customAnswer, setCustomAnswer] = useState<string>("");

  useEffect(() => {
    const associatedResponses = getQuestionResponses(question);

    if (associatedResponses.length) {
      setResponses(associatedResponses);
      const customChoiceId = question.choices?.find((choice) => choice.isCustom)?.id;
      if (!customChoiceId) return;
      const customResponse = associatedResponses.find((response) => response.choiceId === customChoiceId);
      if (customResponse && customResponse.customAnswer) {
        setCustomAnswer(customResponse.customAnswer);
      }
    }
  }, [question, getQuestionResponses]);

  const handleToggle = (choiceId: number | null) => {
    if (!choiceId) return;

    const existingResponses = getQuestionResponses(question);

    const updatedReponses = existingResponses.map((response) => {
      if (response.choiceId === choiceId) {
        return { ...response, selected: !response.selected };
      }
      return response;
    });

    updateQuestionResponses(question, updatedReponses);
  };

  const isChoiceSelected = (choiceId: number | null) => {
    if (!choiceId) return false;
    return reponses.some((response) => response.choiceId === choiceId && response.selected);
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
        {question.choices
          ?.sort((a, b) => a.position - b.position)
          .map((choice) => (
            <FormControlLabel
              key={choice.id}
              control={
                <Checkbox
                  checked={isChoiceSelected(choice.id)}
                  onChange={() => {
                    handleToggle(choice.id);
                  }}
                />
              }
              label={
                <Box sx={customAnswerStyle}>
                  <Typography>{choice.value}</Typography>
                  {choice.isCustom && (
                    <>
                      <Typography>:</Typography>
                      <TextField
                        variant="standard"
                        value={customAnswer}
                        onChange={handleCustomResponseChange}
                      ></TextField>
                    </>
                  )}
                </Box>
              }
            />
          ))}
      </FormControl>
    </Box>
  );
};
