import { Box, FormControl, FormControlLabel, Radio, TextField, Typography } from "@cgi-learning-hub/ui";
import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";

import { IResponse } from "~/core/models/response/type";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { CSS_TEXT_PRIMARY_COLOR } from "~/core/style/cssColors";
import { t } from "~/i18n";
import { useResponse } from "~/providers/ResponseProvider";

import { ChoiceImage } from "../style";
import { IRespondQuestionTypesProps } from "../types";
import { choiceBoxStyle, ChoicesRadioGroup, customAnswerStyle, formControlLabelStyle, labelStyle } from "./style";

export const RespondQuestionSingleAnswerRadio: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponses, updateQuestionResponses, isPageTypeRecap } = useResponse();

  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null);
  const [customAnswer, setCustomAnswer] = useState<string>("");

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

    setSelectedChoiceId(selectedResponse.choiceId ?? null);
  }, [question, getQuestionResponses]);

  const hasOneChoiceWithImage = useMemo(() => {
    return question.choices?.some((choice) => choice.image) ?? false;
  }, [question.choices]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setSelectedChoiceId(value);

    const associatedResponses = getQuestionResponses(question);

    const newResponses: IResponse[] = associatedResponses.map((response) => ({
      ...response,
      selected: response.choiceId === value,
    }));

    updateQuestionResponses(question, newResponses);
  };

  const handleClick = (value: number) => {
    if (value === selectedChoiceId) {
      setSelectedChoiceId(null);

      const associatedResponses = getQuestionResponses(question);

      const newResponses: IResponse[] = associatedResponses.map((response) => ({
        ...response,
        selected: false,
      }));

      updateQuestionResponses(question, newResponses);
    }
  };

  const handleCustomResponseChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newCustomAnswer = e.target.value;
    setCustomAnswer(newCustomAnswer);

    const existingResponses = getQuestionResponses(question);
    const customChoiceId = question.choices?.find((choice) => choice.isCustom)?.id;

    if (!customChoiceId) return;

    setSelectedChoiceId(customChoiceId);

    const updatedResponses = existingResponses.map((response) => {
      if (response.choiceId === customChoiceId) {
        return {
          ...response,
          customAnswer: newCustomAnswer,
          selected: newCustomAnswer.trim() !== "",
        };
      }

      return {
        ...response,
        selected: false,
      };
    });

    updateQuestionResponses(question, updatedResponses);
  };

  return isPageTypeRecap && !selectedChoiceId ? (
    <Typography fontStyle={"italic"}>{t("formulaire.public.response.missing")}</Typography>
  ) : (
    <FormControl disabled={isPageTypeRecap}>
      <ChoicesRadioGroup
        hasOneChoiceWithImage={hasOneChoiceWithImage}
        value={selectedChoiceId?.toString() || ""}
        onChange={handleChange}
      >
        {question.choices
          ?.sort((a, b) => a.position - b.position)
          .map((choice) => (
            <Box key={choice.id} sx={choiceBoxStyle}>
              <FormControlLabel
                value={choice.id?.toString() || ""}
                sx={formControlLabelStyle}
                control={
                  <Radio
                    onClick={() => {
                      handleClick(choice.id ?? -1);
                    }}
                  />
                }
                label={
                  <Box sx={customAnswerStyle}>
                    <Box sx={labelStyle}>
                      <Typography color={TEXT_PRIMARY_COLOR}>{choice.value}</Typography>

                      {choice.isCustom && (
                        <>
                          <Typography>:</Typography>
                          <TextField
                            variant="standard"
                            value={
                              isPageTypeRecap && !customAnswer ? t("formulaire.public.response.missing") : customAnswer
                            }
                            placeholder={t("formulaire.public.response.custom.write")}
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
                        </>
                      )}
                    </Box>

                    {choice.image && (
                      <ChoiceImage src={choice.image.replace("/document", "/pub/document")} alt={choice.value} />
                    )}
                  </Box>
                }
              />
            </Box>
          ))}
      </ChoicesRadioGroup>
    </FormControl>
  );
};
