import { SxProps, Theme } from "@mui/material";
import { COMMON_WHITE_COLOR, PRIMARY_MAIN_COLOR, SECONDARY_MAIN_COLOR } from "~/core/style/colors";

export const sectionHeaderStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: "column",
  backgroundColor: SECONDARY_MAIN_COLOR,
  color: COMMON_WHITE_COLOR,
  borderRadius: 1,
  paddingBottom: 2,
  paddingX: 4,
};

export const sectionContentStyle: SxProps<Theme> = {
  paddingY: 2,
  paddingX: 4,
};

export const sectionFooterStyle: SxProps<Theme> = {
  paddingTop: 2,
  display: "flex",
  alignItems: "center",
};

export const sectionButtonStyle: SxProps<Theme> = {
  color: COMMON_WHITE_COLOR,
};

export const sectionButtonIconStyle: SxProps<Theme> = {
  color: "inherit",
};

export const sectionDragIconStyle: SxProps<Theme> = {
  transform: "rotate(90deg)",
  color: COMMON_WHITE_COLOR,
  fontSize: "3rem",
};

export const sectionStackStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  borderRadius: 1,
  marginBottom: 2,
};

export const sectionAddQuestionStyle: SxProps<Theme> = {
  color: SECONDARY_MAIN_COLOR,
  "&:hover": {
    color: PRIMARY_MAIN_COLOR,
    cursor: "pointer",
  },
};

export const editingSectionTitleStyle: SxProps<Theme> = {
  color: COMMON_WHITE_COLOR,
  "& .MuiInputBase-input": {
    color: COMMON_WHITE_COLOR,
  },
  "& .MuiInputLabel-root": {
    color: COMMON_WHITE_COLOR,
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: COMMON_WHITE_COLOR,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: COMMON_WHITE_COLOR,
  },
};

export const editorContainerStyle = {
  boxSizing: "border-box",
  padding: "0rem 1rem",

  minHeight: "280px",
  "& .ProseMirror[contenteditable='true']": {
    minHeight: "180px",
  },
};
