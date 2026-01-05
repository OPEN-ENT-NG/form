import { Box } from "@cgi-learning-hub/ui";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FC } from "react";
import { IRespondQuestionTypesProps } from "../types";

export const RespondQuestionTime: FC<IRespondQuestionTypesProps> = ({ question }) => {
  console.log(question);
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker ampm={false} />
      </LocalizationProvider>
    </Box>
  );
};
