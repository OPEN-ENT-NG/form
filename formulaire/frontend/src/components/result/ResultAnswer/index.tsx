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
          {completeResponse.files.map((file) => (
            <Link
              key={`${file.id}-${file.filename}`}
              href={`/formulaire/responses/files/${file.id}/download`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileDownloadIcon />
              {file.filename}
            </Link>
          ))}
        </Stack>
      );
    } else {
      return DEFAULT_DISPLAY_ANSWER_VALUE;
    }
  }

  const answer = completeResponse.customAnswer ?? completeResponse.answer;
  if (!answer) return DEFAULT_DISPLAY_ANSWER_VALUE;

  const parsedDate = dayjs(answer);
  if (parsedDate.isValid()) {
    return parsedDate.format(DateFormat.DAY_MONTH_YEAR);
  }

  if (questionType === QuestionTypes.LONGANSWER) {
    return <span dangerouslySetInnerHTML={{ __html: answer }} />;
  }

  return answer.toString();
};
