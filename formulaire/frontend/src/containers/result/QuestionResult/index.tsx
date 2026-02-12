import { FC } from "react";

import { getFormNbResponsesText } from "~/core/models/form/utils";
import { useResult } from "~/providers/ResultProvider";

import { QuestionResultLayout } from "../QuestionResultLayout";
import { IQuestionResultProps } from "./types";

export const QuestionResult: FC<IQuestionResultProps> = ({ question }) => {
  const { getDistributionMap } = useResult();

  const distributionMap = getDistributionMap(question.id);

  return (
    <QuestionResultLayout questionTitle={`${question.title} (${getFormNbResponsesText(distributionMap.size)})`}>
      toto
    </QuestionResultLayout>
  );
};
