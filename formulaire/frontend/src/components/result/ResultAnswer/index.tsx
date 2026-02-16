import { Link, Stack } from "@cgi-learning-hub/ui";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import dayjs from "dayjs";
import { FC } from "react";

import { DEFAULT_DISPLAY_ANSWER_VALUE } from "~/core/constants";
import { DateFormat } from "~/core/enums";
import { QuestionTypes } from "~/core/models/question/enum";

import { IResultAnswerProps } from "./types";

export const ResultAnswer: FC<IResultAnswerProps> = ({ completeResponse, questionType }) => {
  if (questionType === QuestionTypes.FILE) {
    if (completeResponse.files.length) {
      return (
        <Stack>
          {completeResponse.files.map((file) => {
            return (
              <Link
                key={`${file.id}-${file.filename}`}
                href={`/formulaire/responses/files/${file.id}/download`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileDownloadIcon />
                {file.filename}
              </Link>
            );
          })}
        </Stack>
      );
    } else {
      return DEFAULT_DISPLAY_ANSWER_VALUE;
    }
  }
  const answer = completeResponse.answer;
  if (!answer) return DEFAULT_DISPLAY_ANSWER_VALUE;
  if (answer instanceof Date) {
    return dayjs(answer).format(DateFormat.DAY_MONTH_YEAR);
  }
  return answer ? answer.toString() : DEFAULT_DISPLAY_ANSWER_VALUE;
};
