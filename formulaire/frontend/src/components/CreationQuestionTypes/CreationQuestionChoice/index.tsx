import { FC } from "react";
import { Box } from "@cgi-learning-hub/ui";
import { CreationQuestionChoiceWrapper } from "~/containers/CreationQuestionChoiceWrapper";
import { ICreationQuestionTypesProps } from "../types";

export const CreationQuestionChoice: FC<ICreationQuestionTypesProps> = ({ question }) => {
  return (
    <Box>
      <CreationQuestionChoiceWrapper question={question} />
    </Box>
  );
};
