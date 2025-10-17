import { styled, Chip, Box } from "@cgi-learning-hub/ui";
import { columnBoxStyle, flexStartBoxStyle } from "~/core/style/boxStyles";
import { ICustomChipProps, IEditorContainerProps, IHiddenContentProps } from "./types";
import { blockProps } from "~/core/utils";

export const StyledChip = styled(Chip, {
  shouldForwardProp: blockProps("isActive"),
})<ICustomChipProps>(({ theme, isActive }) => ({
  cursor: "pointer",
  fontSize: "1.6rem",
  padding: "1.5rem 0",
  backgroundColor: isActive ? theme.palette.primary.main : theme.palette.grey[200],
  color: isActive ? theme.palette.common.white : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: isActive ? theme.palette.primary.dark : theme.palette.grey[300],
    color: isActive ? theme.palette.common.white : theme.palette.text.primary,
  },
}));

export const StyledEditorContainer = styled(Box, {
  shouldForwardProp: blockProps("isMobile", "showRemind"),
})<IEditorContainerProps>(({ isMobile, showRemind }) => ({
  display: showRemind ? "block" : "none",
  boxSizing: "border-box",
  ...(!isMobile ? { padding: "0rem 2rem" } : {}),
  "& .ProseMirror[contenteditable='true']": {
    minHeight: "180px",
  },
}));

export const mainContentColumnWrapper = {
  ...columnBoxStyle,
  gap: "2rem",
};

export const subContentColumnWrapper = {
  ...columnBoxStyle,
};

export const chipWrapper = { ...flexStartBoxStyle, gap: "2rem" };

export const HiddenContent = styled(Box, {
  shouldForwardProp: blockProps("isVisible"),
})<IHiddenContentProps>(({ isVisible }) => ({
  ...columnBoxStyle,
  display: isVisible ? "flex" : "none",
  gap: "2rem",
}));

export const dialogStyle = {
  container: {
    sx: {
      alignItems: "flex-start",
      paddingTop: "1rem",
    },
  },
  paper: {
    sx: {
      maxHeight: "90vh",
      display: "flex",
      flexDirection: "column",
    },
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
