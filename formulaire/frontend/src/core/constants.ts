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

//IMG PATH
export const LOGO_PATH = "/formulaire/public/img/logo.svg";

//ROOT FOLDERS ID
export const MYFORMS_FOLDER_ID = 1;
export const SHARED_FOLDER_ID = 2;
export const TRASH_FOLDER_ID = 3;

export const FORM_CHUNK = 9;

export const DEFAULT_PAGINATION_LIMIT = 10;
