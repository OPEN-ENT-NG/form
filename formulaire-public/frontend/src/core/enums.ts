export enum ModalType {
  SENDING_CONFIRMATION = "showSendingConfirmation",
}

export enum FormPropField {
  TITLE = "title",
  DESCRIPTION = "description",
  PICTURE = "picture",
  DATE_OPENING = "dateOpening",
  DATE_ENDING = "dateEnding",
  IS_MULTIPLE = "isMultiple",
  IS_ANONYMOUS = "isAnonymous",
  IS_EDITABLE = "isEditable",
  IS_PUBLIC = "isPublic",
  IS_RESPONSE_NOTIFIED = "isResponseNotified",
  HAS_RGPD = "hasRgpd",
  IS_PROGRESS_BAR_DISABLED = "isProgressBarDisabled",
  RGPD_GOAL = "rgpdGoal",
  RGPD_LIFE_TIME = "rgpdLifeTime",
}

export enum TagName {
  FOLDERS = "FOLDERS",
  FORMS = "FORMS",
  DISTRIBUTION = "DISTRIBUTION",
  QUESTIONS = "QUESTIONS",
  SECTIONS = "SECTIONS",
  FORM_ELEMENTS = "FORM_ELEMENTS",
  CHOICE = "CHOICE",
  CHILDREN = "CHILDREN",
}

export enum QueryMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum DraggableType {
  FOLDER = "FOLDER",
  FORM = "FORM",
  NULL = "NULL",
}

export enum CursorStyle {
  POINTER = "pointer",
  NO_DROP = "no-drop",
  DEFAULT = "default",
}

export enum DateFormat {
  YEAR_MONTH_DAY_HOUR_MIN_SEC = "YYYY_MM_DD HH:mm:ss",
  YEAR_MONTH_DAY = "YYYY_MM_DD",
  YEARMONTHDAY = "YYYYMMDD",
  YEAR_MONTH = "YYYY_MM",
  DAY_MONTH_YEAR = "DD/MM/YYYY",
  DAY_MONTH_YEAR_HOUR_MIN = "DD/MM/YYYY HH:mm",
  DAY_MONTH = "DD/MM", // "04/11"
  HOUR_MINUTES = "HH[h]mm", //"09 =00"
  BIRTHDATE = "L",
  DAY_MONTH_YEAR_LETTER = "LL", // "9 juin 2019"
  DAY_DATE = "dddd L",
  DATE_FULL_LETTER = "dddd LL",
  FULL_DATE_WITH_TIME_FORMAT = "DD MMMM YYYY HH:mm",
}

export enum KeyName {
  ENTER = "Enter",
  SPACE = " ",
  DELETE = "Delete",
  ESCAPE = "Escape",
  BACKSPACE = "Backspace",
  ARROW_UP = "ArrowUp",
  ARROW_DOWN = "ArrowDown",
  ARROW_LEFT = "ArrowLeft",
  ARROW_RIGHT = "ArrowRight",
}

export enum SizeAbreviation {
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
  EXTRA_LARGE = "xl",
}

export enum ResponsePageType {
  RGPD = "RGPD",
  DESCRIPTION = "DESCRIPTION",
  FORM_ELEMENT = "FORM_ELEMENT",
  RECAP = "RECAP",
  END_PREVIEW = "END_PREVIEW",
}

// Edifice text Editor

export enum EditorFocusPosition {
  START = "start",
  END = "end",
}

export enum EditorMode {
  EDIT = "edit",
  READ = "read",
}

export enum EditorVariant {
  OUTLINE = "outline",
  GHOST = "ghost",
}

export enum ClickAwayDataType {
  ROOT = "ROOT",
  SECTION = "SECTION",
  QUESTION = "QUESTION",
}

export enum MovementType {
  INDENT = "indent",
  MOVE = "move",
}
