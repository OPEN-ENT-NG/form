import { Theme, ToastPosition } from "react-toastify";
import { RightStringified } from "~/providers/ShareModalProvider/types";

export const FORMULAIRE = "formulaire";
export const ARCHIVE = "archive";
export const COMMON = "common";

export const DEFAULT_THEME = "default";

export const TOAST_CONFIG = {
  position: "top-right" as ToastPosition,
  autoClose: 5000,
  theme: "light" as Theme,
};

//IMAGE PICKER
export const IMAGE_PICKER_INFO = "SVG, PNG, JPG, GIF";

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
