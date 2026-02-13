import { Box, Paper, Stack, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { ERROR_MAIN_COLOR } from "~/core/style/colors";
import { BoxComponentType } from "~/core/style/themeProps";

import { paperStyle } from "./style";
import { QuestionResultLayoutProps } from "./types";

export const QuestionResultLayout: FC<QuestionResultLayoutProps> = ({
  questionTitle,
  children,
  isQuestionMandatory,
  actions,
}) => {
  return (
    <Paper elevation={2} sx={paperStyle}>
      <Stack width="100%" direction="row" justifyContent="space-between" alignItems="center">
        <Box display="flex" gap={1}>
          <Typography variant="h6">{questionTitle}</Typography>
          {isQuestionMandatory && (
            <Typography component={BoxComponentType.SPAN} color={ERROR_MAIN_COLOR}>
              *
            </Typography>
          )}
        </Box>
        {actions}
      </Stack>
      <Stack>{children}</Stack>
    </Paper>
  );
};
