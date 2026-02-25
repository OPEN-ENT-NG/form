import { Stack, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { useResult } from "~/providers/ResultProvider";

import { rowStyle } from "./style";
import { IResultRowProps } from "./types";

export const ResultRow: FC<IResultRowProps> = ({ displayDate, responderName, answer }) => {
  const { form } = useResult();
  return (
    <Stack direction="row" sx={rowStyle} gap={2}>
      <Typography maxWidth="20%" minWidth="20%">
        {displayDate}
      </Typography>
      {!form.anonymous && (
        <Typography maxWidth="30%" minWidth="30%">
          {responderName}
        </Typography>
      )}
      <Typography maxWidth="50%" minWidth="50%">
        {answer}
      </Typography>
    </Stack>
  );
};
