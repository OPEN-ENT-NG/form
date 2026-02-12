import { Paper, Stack, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { paperStyle } from "./style";
import { QuestionResultLayoutProps } from "./types";

export const QuestionResultLayout: FC<QuestionResultLayoutProps> = ({ questionTitle, children }) => {
  return (
    <Paper elevation={2} sx={paperStyle}>
      <Typography variant="h6">{questionTitle}</Typography>
      <Stack>{children}</Stack>
    </Paper>
  );
};
