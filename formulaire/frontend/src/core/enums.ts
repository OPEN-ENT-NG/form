export enum ModalType {
  FOLDER_CREATE = "showFolderCreate",
  FOLDER_RENAME = "showFolderRename",
  MOVE = "showMove",
  DELETE = "showDelete",
  FORM_PROP_CREATE = "showFormPropCreate",
  FORM_PROP_UPDATE = "showFormPropUpdate",
  FORM_OPEN_BLOCKED = "showFormOpenBlocked",
  FORM_IMPORT = "showFormImport",
  FORM_EXPORT = "showFormExport",
  FORM_SHARE = "showFormShare",
  FORM_REMIND = "showFormRemind",
  FORM_ANSWERS = "showFormAnswers",
  FORM_ELEMENT_CREATE = "showFormElementCreate",
  QUESTION_CREATE = "showQuestionCreate",
  QUESTION_UNDO = "showQuestionUndo",
  SECTION_UNDO = "showSectionUndo",
  QUESTION_DELETE = "showQuestionDelete",
  SECTION_DELETE = "showSectionDelete",
  ORGANIZATION = "showOrganization",
  FORM_RESULT_PDF = "showFormResultPdf",
  FORM_RESULT_CSV = "showFormResultCsv",
  SEND_FORM = "showSendForm",
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
