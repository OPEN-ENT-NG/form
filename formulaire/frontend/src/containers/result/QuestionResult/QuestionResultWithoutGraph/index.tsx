import { Stack } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { ResultRow } from "~/components/result/ResultRow";

import { IQuestionResultWithoutGraphProps } from "../types";
import { getDisplayAnswer, getDisplayDate } from "../utils";

export const QuestionResultWithoutGraph: FC<IQuestionResultWithoutGraphProps> = ({ completeResponseList }) => {
  return (
    <Stack gap={1}>
      {completeResponseList.map((completeResponse) => (
        <ResultRow
          key={completeResponse.id}
          displayDate={getDisplayDate(completeResponse)}
          responderName={completeResponse.responderName}
          answer={getDisplayAnswer(completeResponse)}
        />
      ))}
    </Stack>
  );
};
