import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import AppsIcon from "@mui/icons-material/Apps";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import ShortTextRoundedIcon from "@mui/icons-material/ShortTextRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { ReactNode } from "react";

import { CursorIcon } from "~/components/SVG/questionTypes/CursorIcon";
import { MultipleAnswerIcon } from "~/components/SVG/questionTypes/MultipleAnswerIcon";
import { SingleAnswerRadioIcon } from "~/components/SVG/questionTypes/SingleAnswerRadioIcon";
import { UniqueIcon } from "~/components/SVG/questionTypes/UniqueIcon";

import { questionIconStyle } from "./style";

export const questionTypeIcons: Record<number, ReactNode> = {
  1: <TextFieldsRoundedIcon sx={questionIconStyle} />,
  2: <ShortTextRoundedIcon sx={questionIconStyle} />,
  3: <NotesRoundedIcon sx={questionIconStyle} />,
  4: <UniqueIcon />, //Custom
  5: <MultipleAnswerIcon />, //Custom
  6: <CalendarTodayRoundedIcon sx={questionIconStyle} />,
  7: <AccessTimeFilledRoundedIcon sx={questionIconStyle} />,
  8: <UploadFileIcon sx={questionIconStyle} />,
  9: <SingleAnswerRadioIcon />, //Custom
  10: <AppsIcon sx={questionIconStyle} />,
  11: <CursorIcon />, //Custom
  12: <FormatListNumberedRoundedIcon sx={questionIconStyle} />,
};
