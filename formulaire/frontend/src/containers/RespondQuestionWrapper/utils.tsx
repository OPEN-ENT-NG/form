import { Typography } from "@mui/material";
import { RespondQuestionFreetext } from "~/components/RespondQuestionTypes/RespondQuestionFreetext";
import { RespondQuestionShortAnswer } from "~/components/RespondQuestionTypes/RespondQuestionShortAnswer";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { TypographyVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";

export const getRespondQuestionContentByType = (question: IQuestion) => {
  switch (question.questionType) {
    case QuestionTypes.FREETEXT:
      return <RespondQuestionFreetext question={question} />;
    case QuestionTypes.SHORTANSWER:
      return <RespondQuestionShortAnswer question={question} />;
    default:
      return (
        <Typography variant={TypographyVariant.BODY1}>
          {t("formulaire.question.creation.error.type", { questionType: question.questionType })}
        </Typography>
      );
  }
};
