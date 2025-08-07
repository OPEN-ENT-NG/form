import { Typography } from "@mui/material";
import { RefObject } from "react";
import { CreationQuestionFreetext } from "~/components/CreationQuestionTypes/CreationQuestionFreetext";
import { CreationQuestionFile } from "~/components/CreationQuestionTypes/CreationQuestionFile";
import { CreationQuestionLongAnswer } from "~/components/CreationQuestionTypes/CreationQuestionLongAnswer";
import { CreationQuestionShortAnswer } from "~/components/CreationQuestionTypes/CreationQuestionShortAnswer";
import { CreationQuestionDate } from "~/components/CreationQuestionTypes/CreationQuestionDate";
import { CreationQuestionTime } from "~/components/CreationQuestionTypes/CreationQuestionTime";
import { CreationQuestionCursor } from "~/components/CreationQuestionTypes/CreationQuestionCursor";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { TypographyVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { CreationQuestionChoiceWrapper } from "../CreationQuestionChoiceWrapper";

export const getQuestionContentByType = (
  question: IQuestion,
  questionTitleRef: RefObject<HTMLInputElement> | null = null,
) => {
  switch (question.questionType) {
    case QuestionTypes.FREETEXT:
      return <CreationQuestionFreetext question={question} questionTitleRef={questionTitleRef} />;
    case QuestionTypes.SHORTANSWER:
      return <CreationQuestionShortAnswer question={question} />;
    case QuestionTypes.LONGANSWER:
      return <CreationQuestionLongAnswer />;
    case QuestionTypes.DATE:
      return <CreationQuestionDate />;
    case QuestionTypes.TIME:
      return <CreationQuestionTime />;
    case QuestionTypes.CURSOR:
      return <CreationQuestionCursor question={question} />;
    case QuestionTypes.FILE:
      return <CreationQuestionFile />;
    case QuestionTypes.SINGLEANSWER:
    case QuestionTypes.MULTIPLEANSWER:
    case QuestionTypes.SINGLEANSWERRADIO:
      return <CreationQuestionChoiceWrapper question={question} type={question.questionType} />;
    default:
      return (
        <Typography variant={TypographyVariant.BODY1}>
          {t("formulaire.question.creation.error.type", { questionType: question.questionType.toString() })}
        </Typography>
      );
  }
};
