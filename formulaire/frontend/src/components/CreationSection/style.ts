import { SxProps, Theme } from "@mui/material";
import { COMMON_WHITE_COLOR, PRIMARY_MAIN_COLOR, SECONDARY_MAIN_COLOR } from "~/core/style/colors";

export const sectionHeaderWrapperStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: "column",
  backgroundColor: SECONDARY_MAIN_COLOR,
  color: COMMON_WHITE_COLOR,
  borderRadius: 1,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  paddingBottom: 2,
  paddingX: 4,
};

export const sectionHeaderStyle: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  alignItems: "center",
};

export const sectionTitleStyle: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  paddingRight: "1rem",
};

export const sectionIconWrapperStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
};

export const sectionContentStyle: SxProps<Theme> = {
  paddingY: 2,
  paddingX: 4,
};

export const sectionFooterStyle: SxProps<Theme> = {
  paddingTop: 2,
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
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
  boxShadow: "1px 4px 5px 2px rgba(0, 0, 0, 0.1)",
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

export const sectionNewQuestionStyle: SxProps<Theme> = {
  gridColumn: 3,
  justifySelf: "end",
  display: "flex",
};

export const nextElementSelectorWrapperStyle: SxProps<Theme> = {
  gridColumn: 2,
  justifySelf: "center",
  display: "flex",
};

export const nextElementSelectorStyle: SxProps<Theme> = {
  width: 300,
};

export const descriptionStyle: SxProps<Theme> = {
  marginTop: "2rem",
  marginBottom: "3rem",
};
