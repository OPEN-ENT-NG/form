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
  marginBottom: 2,
};

export const choiceWrapperStyle: SxProps = {
  display: "flex",
  alignItems: "center",
};

export const upDownButtonsWrapperStyle: SxProps = {
  display: "flex",
  alignItems: "center",
  minWidth: 56,
};

export const deleteWrapperStyle: SxProps = {
  display: "flex",
  alignItems: "center",
  minWidth: 42,
};

export const deleteButtonIconStyle: SxProps = {
  marginLeft: 1,
  marginTop: 2,
};

export const newChoiceWrapperStyle: SxProps = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  paddingLeft: "56px", //Match updown buttons width
  paddingRight: "42px", //Match delete button width
};

export const choiceInputStyle: SxProps = {
  marginLeft: 1,
};

export const otherChoiceSpanStyle: SxProps = {
  cursor: "pointer",
  color: PRIMARY_MAIN_COLOR,
  "&:hover": {
    color: PRIMARY_DARKER_COLOR,
  },
};

export const baseChoiceWrapperStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export const choiceStyle: SxProps = {
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
