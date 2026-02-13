import { ReactNode } from "react";

export interface QuestionResultLayoutProps {
  questionTitle: ReactNode;
  children: ReactNode;
  isQuestionMandatory: boolean;
  actions?: ReactNode;
}
