import { Typography } from "@mui/material";
import { RefObject } from "react";
import { CreationQuestionFreetext } from "~/components/CreationQuestionTypes/CreationQuestionFreetext";
import { CreationQuestionLongAnswer } from "~/components/CreationQuestionTypes/CreationQuestionLongAnswer";
import { CreationQuestionShortAnswer } from "~/components/CreationQuestionTypes/CreationQuestionShortAnswer";
import { CreationQuestionDate } from "~/components/CreationQuestionTypes/CreationQuestionDate";
import { CreationQuestionTime } from "~/components/CreationQuestionTypes/CreationQuestionTime";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";

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
    default:
      return <Typography variant="body1">Unsupported question type {question.questionType.toString()}</Typography>;
  }
};
