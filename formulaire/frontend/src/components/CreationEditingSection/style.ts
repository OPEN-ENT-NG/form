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
  paddingTop: "3rem",
};

export const sectionTitleStyle: SxProps<Theme> = {
  width: "100%",
  paddingX: "1rem",
};

export const sectionIconWrapperStyle: SxProps<Theme> = {
  width: "auto",
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
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

export const editorContainerStyle = {
  boxSizing: "border-box",
  padding: "0rem 1rem",

  minHeight: "280px",
  "& .ProseMirror[contenteditable='true']": {
    minHeight: "180px",
  },
};
