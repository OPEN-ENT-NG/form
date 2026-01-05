import { Typography } from "@mui/material";
import { RespondQuestionCursor } from "~/components/RespondQuestionTypes/RespondQuestionCursor";
import { RespondQuestionDate } from "~/components/RespondQuestionTypes/RespondQuestionDate";
import { RespondQuestionFreetext } from "~/components/RespondQuestionTypes/RespondQuestionFreetext";
import { RespondQuestionLongAnswer } from "~/components/RespondQuestionTypes/RespondQuestionLongAnswer";
import { RespondQuestionShortAnswer } from "~/components/RespondQuestionTypes/RespondQuestionShortAnswer";
import { RespondQuestionSingleAnswer } from "~/components/RespondQuestionTypes/RespondQuestionSingleAnswer";
import { RespondQuestionSingleAnswerRadio } from "~/components/RespondQuestionTypes/RespondQuestionSingleAnswerRadio";
import { RespondQuestionTime } from "~/components/RespondQuestionTypes/RespondQuestionTime";
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
    case QuestionTypes.LONGANSWER:
      return <RespondQuestionLongAnswer question={question} />;
    case QuestionTypes.DATE:
      return <RespondQuestionDate question={question} />;
    case QuestionTypes.TIME:
      return <RespondQuestionTime question={question} />;
    case QuestionTypes.CURSOR:
      return <RespondQuestionCursor question={question} />;
    case QuestionTypes.SINGLEANSWER:
      return <RespondQuestionSingleAnswer question={question} />;
    case QuestionTypes.SINGLEANSWERRADIO:
      return <RespondQuestionSingleAnswerRadio question={question} />;
    default:
      return (
        <Typography variant={TypographyVariant.BODY1}>
          {t("formulaire.question.creation.error.type", { questionType: question.questionType })}
        </Typography>
      );
  }
};
