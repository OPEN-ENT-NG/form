import { SxProps, Theme } from "@mui/material";

import { COMMON_WHITE_COLOR, SECONDARY_MAIN_COLOR } from "~/core/style/colors";
import { CSS_DIVIDER_COLOR } from "~/core/style/cssColors";

export const sectionHeaderWrapperStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: "column",
  backgroundColor: SECONDARY_MAIN_COLOR,
  color: COMMON_WHITE_COLOR,
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
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
  border: `1px solid ${CSS_DIVIDER_COLOR}`,
  borderTop: "none",
  borderBottomLeftRadius: "4px",
  borderBottomRightRadius: "4px",
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
  background: "transparent !important",
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
