import { Typography } from "@mui/material";
import { RefObject } from "react";

import { CreationQuestionCursor } from "~/components/CreationQuestionTypes/CreationQuestionCursor";
import { CreationQuestionDate } from "~/components/CreationQuestionTypes/CreationQuestionDate";
import { CreationQuestionFile } from "~/components/CreationQuestionTypes/CreationQuestionFile";
import { CreationQuestionFreetext } from "~/components/CreationQuestionTypes/CreationQuestionFreetext";
import { CreationQuestionLongAnswer } from "~/components/CreationQuestionTypes/CreationQuestionLongAnswer";
import { CreationQuestionMatrix } from "~/components/CreationQuestionTypes/CreationQuestionMatrix";
import { CreationQuestionShortAnswer } from "~/components/CreationQuestionTypes/CreationQuestionShortAnswer";
import { CreationQuestionTime } from "~/components/CreationQuestionTypes/CreationQuestionTime";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { TypographyVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";

import { CreationQuestionChoiceWrapper } from "../CreationQuestionChoiceWrapper";

export const getQuestionContentByType = (
  question: IQuestion,
  questionTitleRef: RefObject<HTMLInputElement> | null = null,
  matrixType: QuestionTypes,
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
    case QuestionTypes.MATRIX:
      return <CreationQuestionMatrix question={question} matrixType={matrixType} />;
    case QuestionTypes.SINGLEANSWER:
    case QuestionTypes.MULTIPLEANSWER:
    case QuestionTypes.SINGLEANSWERRADIO:
      return <CreationQuestionChoiceWrapper question={question} type={question.questionType} />;
    case QuestionTypes.RANKING:
      return <CreationQuestionChoiceWrapper question={question} type={question.questionType} hideCustomChoice />;
    default:
      return (
        <Typography variant={TypographyVariant.BODY1}>
          {t("formulaire.question.creation.error.type", { questionType: question.questionType })}
        </Typography>
      );
  }
};
