import { Theme, ToastPosition } from "react-toastify";

import { RightStringified } from "~/providers/ShareModalProvider/types";

import { QuestionTypes } from "./models/question/enum";

export const FORMULAIRE = "formulaire";
export const ARCHIVE = "archive";
export const COMMON = "common";

export const DEFAULT_THEME = "default";

export const TOAST_CONFIG = {
  position: "top-right" as ToastPosition,
  autoClose: 5000,
  theme: "light" as Theme,
};

export const defaultViewMaxWidth = "1400px";
export const defaultViewBackgroundColor = "white";
export const defaultPaperShadow = "1px 4px 5px 2px rgba(0, 0, 0, 0.1)";

//IMAGE PICKER
export const IMAGE_PICKER_INFO = "SVG, PNG, JPG, GIF";
export const MAX_FILES_SAVE = 10;

//DATE FORMAT
export const DD_MM_YYYY = "DD/MM/YYYY";
export const FULL_DATE_WITH_TIME_FORMAT = "DD MMMM YYYY HH:mm";
export const HH_MM = "HH:mm";

//IMG PATH
export const LOGO_PATH = "/formulaire/public/img/logo.svg";

//ROOT FOLDERS ID
export const MYFORMS_FOLDER_ID = 1;
export const SHARED_FOLDER_ID = 2;
export const TRASH_FOLDER_ID = 3;

export const FORM_CHUNK = 9;

//EXPORT
export const PDF_EXTENSION = ".pdf";
export const ZIP_EXTENSION = ".zip";
export const LINK_HTML_ELEMENT = "a";

//MISC
export const ID = "id";
export const DEFAULT_PAGINATION_LIMIT = 10;

//RIGHTS
export const MANAGER_RIGHT: RightStringified = "manager";
export const CONTRIB_RIGHT: RightStringified = "contrib";
export const COMMENT_RIGHT: RightStringified = "comment";

//MEDIA LIBRARY
export const PROTECTED_VISIBILITY = "protected";

//FILE EXTENSIONS
export const IMAGE_CONTENT_TYPE = "image/*";
export const PNG_EXTENSION = ".png";
export const JPG_EXTENSION = ".jpg";
export const JPEG_EXTENSION = ".jpeg";
export const GIF_EXTENSION = ".gif";
export const SVG_EXTENSION = ".svg";

//QUESTIONS
export const DEFAULT_NB_CHOICES = 3;
export const DEFAULT_NB_CHILDREN = 3;
export const DEFAULT_CURSOR_STEP = 1;

//TARGET NEXT ELEMENT
export const TARGET_RECAP = "targetRecap";

//CURSOR STYLES
export const CURSOR_STYLE_GRABBING = "grabbing";
export const CURSOR_STYLE_DEFAULT = "default";

//DND
export const DRAG_HORIZONTAL_TRESHOLD = 40;

//EDITOR
export const EDITOR_CONTENT_HTML = "html";

//MOUSE EVENTS
export const MOUSE_EVENT_DOWN = "onMouseDown";
export const TOUCH_EVENT_START = "onTouchStart";

// RESPONSIVE
export const MOBILE_MAX_WIDTH = 920;
export const TABLET_MAX_WIDTH = 768;

// Variable types
export const STRING = "string";
export const FILE = "file";

// Result View
export const DEFAULT_DISPLAY_ANSWER_VALUE = "-";

//Icones des types de question
export const QUESTION_TYPE_ICONS: Record<QuestionTypes, string> = {
  [QuestionTypes.FREETEXT]: "free-text",
  [QuestionTypes.SHORTANSWER]: "short-answer",
  [QuestionTypes.LONGANSWER]: "long-answer",
  [QuestionTypes.SINGLEANSWER]: "unic-answer",
  [QuestionTypes.MULTIPLEANSWER]: "multiple-answer",
  [QuestionTypes.DATE]: "date",
  [QuestionTypes.TIME]: "time",
  [QuestionTypes.FILE]: "file",
  [QuestionTypes.SINGLEANSWERRADIO]: "singleanswer_radio",
  [QuestionTypes.MATRIX]: "matrix",
  [QuestionTypes.CURSOR]: "cursor",
  [QuestionTypes.RANKING]: "ranking",
};

const BLUE_COLORS = ["#37A4CD", "#1691C0", "#056F98", "#5AB7DA", "#89CEE9"];
const YELLOW_COLORS = ["#FFC73C", "#F2AE00", "#FFBB13", "#FFD263", "#FFDF91"];
const PURPLE_COLORS = ["#475DD5", "#1129A6", "#2741C9", "#687BE0", "#93A1EC"];
const ORANGE_COLORS = ["#FFA23C", "#F27E00", "#FF8E13", "#FFB463", "#FFCA91"];

const COLOR_GROUPS = [BLUE_COLORS, YELLOW_COLORS, PURPLE_COLORS, ORANGE_COLORS] as const;

export const GRAPH_COLORS = Array.from({ length: Math.max(...COLOR_GROUPS.map((g) => g.length)) }, (_, i) =>
  COLOR_GROUPS.map((group) => group[i]).filter(Boolean),
).flat();

export const NB_COLORS_AVAILABLE: number = 25;
export const INITIAL_TREE_SCALE = 75;
