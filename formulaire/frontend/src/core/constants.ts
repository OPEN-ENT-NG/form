import { Theme, ToastPosition } from "react-toastify";

export const FORMULAIRE = "formulaire";
export const ARCHIVE = "archive";

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

//IMG PATH
export const LOGO_PATH = "/img/logo.svg";

//ROOT FOLDERS ID
export const MYFORMS_FOLDER_ID = 1;
export const SHARED_FOLDER_ID = 2;
export const TRASH_FOLDER_ID = 3;

export const FORM_CHUNK = 9;
