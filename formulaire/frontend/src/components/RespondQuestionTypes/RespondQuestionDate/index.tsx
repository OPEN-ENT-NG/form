import { Box, DatePicker } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { IRespondQuestionTypesProps } from "../types";

export const RespondQuestionDate: FC<IRespondQuestionTypesProps> = ({ question }) => {
  console.log(question);
  return (
    <Box>
      <DatePicker adapterLocale="fr" />
    </Box>
  );
};
