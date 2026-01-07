import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from "@cgi-learning-hub/ui";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useResponse } from "~/providers/ResponseProvider";
import { IRespondQuestionTypesProps } from "../types";

export const RespondQuestionSingleAnswerRadio: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponse, updateQuestionResponses } = useResponse();
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    const associatedResponse = getQuestionResponse(question);
    if (!associatedResponse) return;

    const existingAnswer = associatedResponse.answer;
    if (typeof existingAnswer === "string") {
      setSelectedValue(existingAnswer);
    }
  }, [question, getQuestionResponse]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedValue(value);

    const associatedResponse = getQuestionResponse(question);
    if (!question.id || !associatedResponse) return;

    associatedResponse.answer = value;
    updateQuestionResponses(question, [associatedResponse]);
  };

  return (
    <Box>
      <FormControl>
        <RadioGroup value={selectedValue || ""} onChange={handleChange}>
          {question.choices
            ?.sort((a, b) => a.position - b.position)
            .map((choice) => (
              <FormControlLabel key={choice.id} value={choice.value} control={<Radio />} label={choice.value} />
            ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};
