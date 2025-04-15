import { styled, Chip, Box } from "@cgi-learning-hub/ui";
import { columnBoxStyle, flexStartBoxStyle } from "~/core/style/boxStyles";
import { ICustomChipProps, IHiddenContentProps } from "./types";

export const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<ICustomChipProps>(({ theme, isActive }) => ({
  cursor: "pointer",
  fontSize: "1.6rem",
  padding: "1.5rem 0",
  backgroundColor: isActive ? theme.palette.primary.main : theme.palette.grey[200],
  color: isActive ? theme.palette.common.white : theme.palette.text.primary,
}));

export const editorContainerStyle = {
  boxSizing: "border-box",
  padding: "0rem 2rem",
  "& .ProseMirror[contenteditable='true']": {
    minHeight: "180px",
  },
};

export const mainContentColumnWrapper = {
  ...columnBoxStyle,
  gap: "2rem",
};

export const subContentColumnWrapper = {
  ...columnBoxStyle,
};

export const chipWrapper = { ...flexStartBoxStyle, gap: "2rem" };

export const HiddenContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isVisible",
})<IHiddenContentProps>(({ isVisible }) => ({
  ...columnBoxStyle,
  display: isVisible ? "flex" : "none",
  gap: "2rem",
}));

export const dialogStyle = {
  "& .MuiDialog-paper": {
    maxHeight: "80vh",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
  },
};

export const buttonStyle = {
  marginLeft: "2rem",
};

export const loaderContainerStyle = {
  height: "20rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
