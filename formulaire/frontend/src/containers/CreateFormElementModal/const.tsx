import { ReactNode } from "react";
import { CursorIcon } from "~/components/SVG/questionTypes/CursorIcon";
import { DateIcon } from "~/components/SVG/questionTypes/DateIcon";
import { FileIcon } from "~/components/SVG/questionTypes/FileIcon";
import { FreeTextIcon } from "~/components/SVG/questionTypes/FreeTextIcon";
import { LongAnswerIcon } from "~/components/SVG/questionTypes/LongAnswerIcon";
import { MatrixIcon } from "~/components/SVG/questionTypes/MatrixIcon";
import { MultipleAnswerIcon } from "~/components/SVG/questionTypes/MultipleAnswerIcon";
import { RankingIcon } from "~/components/SVG/questionTypes/RankingIcon";
import { ShortAnswerIcon } from "~/components/SVG/questionTypes/ShortAnswerIcon";
import { SingleAnswerRadioIcon } from "~/components/SVG/questionTypes/SingleAnswerRadioIcon";
import { TimeIcon } from "~/components/SVG/questionTypes/TimeIcon";
import { UniqueIcon } from "~/components/SVG/questionTypes/UniqueIcon";

export const questionTypeIcons: Record<number, ReactNode> = {
  1: <FreeTextIcon />,
  2: <ShortAnswerIcon />,
  3: <LongAnswerIcon />,
  4: <UniqueIcon />,
  5: <MultipleAnswerIcon />,
  6: <DateIcon />,
  7: <TimeIcon />,
  8: <FileIcon />,
  9: <SingleAnswerRadioIcon />,
  10: <MatrixIcon />,
  11: <CursorIcon />,
  12: <RankingIcon />,
};
