import { Stack } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { ResultAnswer } from "~/components/result/ResultAnswer";
import { ResultRow } from "~/components/result/ResultRow";

import { IQuestionResultWithoutGraphProps } from "../types";
import { getDisplayDate } from "../utils";

export const QuestionResultWithoutGraph: FC<IQuestionResultWithoutGraphProps> = ({
  completeResponseList,
  questionType,
}) => {
  return (
    <Stack gap={1}>
      {completeResponseList.map((completeResponse) => (
        <ResultRow
          key={completeResponse.id}
          displayDate={getDisplayDate(completeResponse)}
          responderName={completeResponse.responderName}
          answer={<ResultAnswer completeResponse={completeResponse} questionType={questionType} />}
        />
      ))}
    </Stack>
  );
};
