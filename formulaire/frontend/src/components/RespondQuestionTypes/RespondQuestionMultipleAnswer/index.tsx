import { Box, Checkbox, FormControlLabel, TextField, Typography } from "@cgi-learning-hub/ui";
import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { IResponse } from "~/core/models/response/type";
import { useResponse } from "~/providers/ResponseProvider";
import { ChoiceImage } from "../style";
import { IRespondQuestionTypesProps } from "../types";
import { choiceBoxStyle, customAnswerStyle, formControlLabelStyle, labelStyle, StyledFormControl } from "./style";

export const RespondQuestionMultipleAnswer: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponses, updateQuestionResponses } = useResponse();
  const [reponses, setResponses] = useState<IResponse[]>([]);
  const [customAnswer, setCustomAnswer] = useState<string>("");
  const { t } = useTranslation(FORMULAIRE);

  useEffect(() => {
    const associatedResponses = getQuestionResponses(question);

    if (associatedResponses.length) {
      setResponses(associatedResponses);
      const customChoiceId = question.choices?.find((choice) => choice.isCustom)?.id;
      if (!customChoiceId) return;
      const customResponse = associatedResponses.find((response) => response.choiceId === customChoiceId);
      if (customResponse) {
        setCustomAnswer(customResponse.customAnswer ?? "");
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
        return {
          ...response,
          customAnswer: newCustomAnswer,
          selected: newCustomAnswer.trim() !== "",
        };
      }
      return response;
    });

    updateQuestionResponses(question, updatedReponses);
  };

  const hasOneChoiceWithImage = useMemo(() => {
    return question.choices?.some((choice) => choice.image) ?? false;
  }, [question.choices]);

  return (
    <Box>
      <StyledFormControl hasOneChoiceWithImage={hasOneChoiceWithImage}>
        {question.choices
          ?.sort((a, b) => a.position - b.position)
          .map((choice) => (
            <Box key={choice.id} sx={choiceBoxStyle}>
              <FormControlLabel
                sx={formControlLabelStyle}
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
      </StyledFormControl>
    </Box>
  );
};
