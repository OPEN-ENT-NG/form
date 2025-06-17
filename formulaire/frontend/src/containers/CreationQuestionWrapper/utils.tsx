import { Typography } from "@mui/material";
import { CreationQuestionFreetext } from "~/components/CreationQuestionTypes/CreationQuestionFreetext";
import { CreationQuestionLongAnswer } from "~/components/CreationQuestionTypes/CreationQuestionLongAnswer";
import { CreationQuestionShortAnswer } from "~/components/CreationQuestionTypes/CreationQuestionShortAnswer";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";

export const getQuestionContentByType = (question: IQuestion) => {
  switch (question.questionType) {
    case QuestionTypes.FREETEXT:
      return <CreationQuestionFreetext question={question} />;
    case QuestionTypes.SHORTANSWER:
      return <CreationQuestionShortAnswer question={question} />;
    case QuestionTypes.LONGANSWER:
      return <CreationQuestionLongAnswer />;
    default:
      return <Typography variant="body1">Unsupported question type {question.questionType.toString()}</Typography>;
  }
};
