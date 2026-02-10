import { FC } from "react";

import { QuestionResult } from "../QuestionResult";
import { SectionResultLayout } from "../SectionResultLayout";
import { ISectionResultProps } from "./types";

export const SectionResult: FC<ISectionResultProps> = ({ section }) => {
  return (
    <SectionResultLayout section={section}>
      {section.questions.map((question) => (
        <QuestionResult key={question.id} question={question} />
      ))}
    </SectionResultLayout>
  );
};
