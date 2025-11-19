import { Typography } from "@mui/material";
import { IQuestion } from "~/core/models/question/types";
import { TypographyVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";

export const getRespondQuestionContentByType = (question: IQuestion) => {
  switch (question.questionType) {
    default:
      return (
        <Typography variant={TypographyVariant.BODY1}>
          {t("formulaire.question.creation.error.type", { questionType: question.questionType })}
        </Typography>
      );
  }
};
