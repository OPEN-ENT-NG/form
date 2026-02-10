import { FC } from "react";

import { QuestionResultLayout } from "../QuestionResultLayout";
import { IQuestionResultProps } from "./types";

export const QuestionResult: FC<IQuestionResultProps> = ({ question }) => {
  return <QuestionResultLayout question={question}>{question.label}</QuestionResultLayout>;
};
