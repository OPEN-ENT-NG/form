import { FC } from "react";
import { IRespondQuestionWrapperProps } from "./types";
import { Box, Paper, Stack, Typography } from "@cgi-learning-hub/ui";
import { getRespondQuestionContentByType } from "./utils";
import { mandatoryTitleStyle, questionStackStyle } from "./style";
import { BoxComponentType, TypographyVariant } from "~/core/style/themeProps";
import { ERROR_MAIN_COLOR, TEXT_PRIMARY_COLOR, TEXT_SECONDARY_COLOR } from "~/core/style/colors";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";

export const RespondQuestionWrapper: FC<IRespondQuestionWrapperProps> = ({ question }) => {
  const { t } = useTranslation(FORMULAIRE);

  return (
    <Stack component={Paper} sx={questionStackStyle}>
      <Typography variant={TypographyVariant.H6} color={question.title ? TEXT_PRIMARY_COLOR : TEXT_SECONDARY_COLOR}>
        {question.title || t("formulaire.question.title.empty")}
        {question.mandatory && (
          <Typography component={BoxComponentType.SPAN} color={ERROR_MAIN_COLOR} sx={mandatoryTitleStyle}>
            *
          </Typography>
        )}
      </Typography>
      <Box>{getRespondQuestionContentByType(question)}</Box>
    </Stack>
  );
};
