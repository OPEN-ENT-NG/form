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
import { t } from "~/i18n";

export const displayTypeName = (typeName: string): string => {
  return t("formulaire.question.type." + typeName);
};

export const displayTypeDescription = (typeName: string): string => {
  return t("formulaire.question.type.description." + typeName);
};

export const getQuestionTypeIcon = (typeCode: number) => {
  switch (typeCode) {
    case 1:
      return <FreeTextIcon />;
    case 2:
      return <ShortAnswerIcon />;
    case 3:
      return <LongAnswerIcon />;
    case 4:
      return <UniqueIcon />;
    case 5:
      return <MultipleAnswerIcon />;
    case 6:
      return <DateIcon />;
    case 7:
      return <TimeIcon />;
    case 8:
      return <FileIcon />;
    case 9:
      return <SingleAnswerRadioIcon />;
    case 10:
      return <MatrixIcon />;
    case 11:
      return <CursorIcon />;
    case 12:
      return <RankingIcon />;
    default:
      return null;
  }
};
