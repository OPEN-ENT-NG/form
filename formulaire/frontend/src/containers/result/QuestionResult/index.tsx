import { FC } from "react";

import { getFormNbResponsesText } from "~/core/models/form/utils";
import { useResult } from "~/providers/ResultProvider";

import { QuestionResultLayout } from "../QuestionResultLayout";
import { IQuestionResultProps } from "./types";
import { renderQuestionResult } from "./utils";

export const QuestionResult: FC<IQuestionResultProps> = ({ question }) => {
  const { getDistributionMap } = useResult();

  const distributionMap = getDistributionMap(question.id);

  return (
    <QuestionResultLayout questionTitle={`${question.title} (${getFormNbResponsesText(distributionMap.size)})`}>
      {renderQuestionResult(question.questionType, distributionMap)}
    </QuestionResultLayout>
  );
};
