import { Box, Stack } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { ResultAnswer } from "~/components/result/ResultAnswer";
import { ResultRow } from "~/components/result/ResultRow";
import { rowStyle } from "~/components/result/ResultRow/style";
import { QuestionTypes } from "~/core/models/question/enum";

import { IQuestionResultWithoutGraphProps } from "../types";
import { getDisplayDate } from "../utils";

export const QuestionResultWithoutGraph: FC<IQuestionResultWithoutGraphProps> = ({
  completeResponseList,
  question,
}) => {
  if (question.questionType === QuestionTypes.FREETEXT) {
    return <Box sx={rowStyle} dangerouslySetInnerHTML={{ __html: question.statement ?? "" }} />;
  }
  return (
    <Stack gap={1}>
      {completeResponseList.map((completeResponse) => (
        <ResultRow
          key={completeResponse.id}
          displayDate={getDisplayDate(completeResponse)}
          responderName={completeResponse.responderName}
          answer={<ResultAnswer completeResponse={completeResponse} questionType={question.questionType} />}
        />
      ))}
    </Stack>
  );
};
