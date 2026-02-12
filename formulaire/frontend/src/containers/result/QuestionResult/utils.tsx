import { QuestionTypes } from "~/core/models/question/enum";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

import { QuestionShortAnswerResult } from "./QuestionShortAnswerResult";

export const renderQuestionResult = (questionType: QuestionTypes, distributionMap: DistributionMap) => {
  switch (questionType) {
    case QuestionTypes.SHORTANSWER:
      return <QuestionShortAnswerResult distributionMap={distributionMap} />;
    default:
      return "pas encore fait";
  }
};
