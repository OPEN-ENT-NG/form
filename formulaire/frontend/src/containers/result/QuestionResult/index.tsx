import { Box } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { DownloadFilesZip } from "~/components/result/DownloadFilesZip";
import { getFormNbResponsesText } from "~/core/models/form/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { useResult } from "~/providers/ResultProvider";

import { QuestionResultLayout } from "../QuestionResultLayout";
import { IQuestionResultProps } from "./types";
import { hasAtLeastOneFile, renderQuestionResult } from "./utils";

export const QuestionResult: FC<IQuestionResultProps> = ({ question }) => {
  const { getDistributionMap } = useResult();

  const distributionMap = getDistributionMap(question.id);

  const showFileDownloadZip = question.questionType === QuestionTypes.FILE && hasAtLeastOneFile(distributionMap);

  return (
    <QuestionResultLayout
      questionTitle={`${question.title} (${getFormNbResponsesText(distributionMap.size)})`}
      isQuestionMandatory={question.mandatory}
      actions={showFileDownloadZip && question.id ? <DownloadFilesZip questionId={question.id} /> : undefined}
    >
      <Box mt={2}>{renderQuestionResult(question.questionType, distributionMap)}</Box>
    </QuestionResultLayout>
  );
};
