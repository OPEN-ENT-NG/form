import { ReactNode } from "react";

import { IQuestion } from "~/core/models/question/types";

export interface QuestionResultLayoutProps {
  question: IQuestion;
  children: ReactNode;
}
