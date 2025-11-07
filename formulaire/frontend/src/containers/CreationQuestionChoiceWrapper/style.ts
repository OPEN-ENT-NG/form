import { SxProps } from "@mui/material";
import { PRIMARY_DARKER_COLOR, PRIMARY_MAIN_COLOR } from "~/core/style/colors";
import { styled, Box } from "@cgi-learning-hub/ui";
import { INewChoiceWrapperProps } from "./types";

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

export const StyledSortWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isConditional",
})<{ isConditional?: boolean }>(({ isConditional }) => ({
  display: "flex",
  justifyContent: "flex-end",
  ...(isConditional && {
    width: "55%",
  }),
}));

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

export const baseChoiceWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  paddingLeft: "56px", //Match updown buttons width
  paddingRight: "42px", //Match delete button width
} as const;

export const customChoiceWrapperStyle = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  width: "100%",
  paddingLeft: "56px", //Match updown buttons width
} as const;

export const choiceInputStyle: SxProps = {
  marginLeft: 1,
};

export const NewChoiceWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "hasImage",
})<INewChoiceWrapperProps>(({ hasImage }) => ({
  ...baseChoiceWrapperStyle,
  minHeight: "40px",
  paddingRight: hasImage ? "82px !important" : "42px", // Match delete button and image button width
}));

export const newChoiceInputStyle: SxProps = {
  ...choiceInputStyle,
  "& .MuiInputBase-root": {
    marginTop: 0, // Override the default margin
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

export const unselectedChoiceStyle: SxProps = {
  marginLeft: 1,
  "& .MuiInputBase-input": {
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
