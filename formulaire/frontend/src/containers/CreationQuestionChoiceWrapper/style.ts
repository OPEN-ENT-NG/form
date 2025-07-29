import { SxProps } from "@mui/material";
import { PRIMARY_DARKER_COLOR, PRIMARY_MAIN_COLOR } from "~/core/style/colors";

export const sortWrapperStyle: SxProps = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  cursor: "pointer",
  color: PRIMARY_MAIN_COLOR,
  "&:hover": {
    color: PRIMARY_DARKER_COLOR,
  },
};

export const sortIconStyle: SxProps = {
  fontSize: "2rem",
  marginRight: 0.5,
};

export const choicesWrapperStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  marginY: 2,
  gap: 1,
};

export const choiceWrapperStyle: SxProps = {
  display: "flex",
  alignItems: "flex-start",
};

export const upDownButtonsWrapperStyle: SxProps = {
  display: "flex",
  alignItems: "center",
  minWidth: 56,
  minHeight: 40,
};

export const deleteWrapperStyle: SxProps = {
  display: "flex",
  alignItems: "center",
  minWidth: 42,
};

export const deleteButtonIconStyle: SxProps = {
  marginLeft: 1,
  minHeight: 40,
};

export const baseChoiceWrapperStyle: SxProps = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  paddingLeft: "56px", //Match updown buttons width
};

export const choiceInputStyle: SxProps = {
  marginLeft: 1,
};

export const newChoiceWrapperStyle: SxProps = {
  minHeight: "40px",
  ...baseChoiceWrapperStyle,
};

export const newChoiceInputStyle: SxProps = {
  ...choiceInputStyle,
  "& .MuiInputBase-root": {
    marginTop: 0, // Override the default margin
  },
  "& .MuiInputBase-input": {
    color: "text.secondary", // Label-like color for the value text
  },
};

export const otherChoiceSpanStyle: SxProps = {
  cursor: "pointer",
  color: PRIMARY_MAIN_COLOR,
  "&:hover": {
    color: PRIMARY_DARKER_COLOR,
  },
};

export const notEditingchoicesWrapperStyle: SxProps = {
  ...choicesWrapperStyle,
  gap: 2,
};

export const choiceStyle: SxProps = {
  marginLeft: 1,
  "& .MuiInputBase-input": {
    color: "text.disabled",
    cursor: "default",
    caretColor: "transparent",
  },
  "& .MuiInput-underline:before": {
    borderBottom: "1px solid var(--theme-palette-text-disabled) !important",
  },
  "& .MuiInput-underline:hover:before": {
    borderBottom: "1px solid var(--theme-palette-text-disabled) !important",
  },
  "& .MuiInput-underline:after": {
    borderBottom: "none !important", // Remove focus underline
  },
};
