import { Typography } from "@mui/material";
import { CreationQuestionShortAnswer } from "~/components/CreationQuestionTypes/CreationQuestionShortAnswer";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";

export const getQuestionContentByType = (question: IQuestion) => {
  switch (question.questionType) {
    case QuestionTypes.SHORTANSWER:
      return <CreationQuestionShortAnswer question={question} />;
    default:
      return <Typography variant="body1">Unsupported question type {question.questionType.toString()}</Typography>;
  }
};
