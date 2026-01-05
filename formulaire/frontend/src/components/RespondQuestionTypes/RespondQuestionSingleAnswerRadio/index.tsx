import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FC } from "react";
import { IRespondQuestionTypesProps } from "../types";

export const RespondQuestionSingleAnswerRadio: FC<IRespondQuestionTypesProps> = ({ question }) => {
  return (
    <Box>
      <FormControl>
        <RadioGroup>
          {question.choices
            ?.sort((a, b) => a.position - b.position)
            .map((choice) => (
              <FormControlLabel key={choice.id} value={choice.id ?? 0} control={<Radio />} label={choice.value} />
            ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};
