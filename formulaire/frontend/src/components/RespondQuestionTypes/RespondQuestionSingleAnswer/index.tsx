import { Box } from "@cgi-learning-hub/ui";
import { FormControl, MenuItem, Select } from "@mui/material";
import { FC } from "react";
import { IRespondQuestionTypesProps } from "../types";

export const RespondQuestionSingleAnswer: FC<IRespondQuestionTypesProps> = ({ question }) => {
  return (
    <Box>
      <FormControl fullWidth>
        <Select>
          {question.choices
            ?.sort((a, b) => a.position - b.position)
            .map((choice) => (
              <MenuItem key={choice.id} value={choice.id ?? 0}>
                {choice.value}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
};
