import { IconButton, Paper, styled, SxProps } from "@cgi-learning-hub/ui";
import { IStyledPaperProps } from "./types";

export const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isSection",
})<IStyledPaperProps>(({ theme, isSection }) => ({
  display: "flex",
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(0.5, 1),
  backgroundColor: isSection ? theme.palette.secondary.main : theme.palette.background.paper,
  color: isSection ? theme.palette.primary.contrastText : theme.palette.text.primary,
}));

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "isSection",
})<IStyledPaperProps>(({ theme, isSection }) => ({
  padding: 0,
  color: isSection ? theme.palette.primary.contrastText : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: isSection ? theme.palette.secondary.dark : theme.palette.action.hover,
  },
}));

export const dragIconStyle: SxProps = {
  fontSize: "3rem",
};

export const arrowIconStyle: SxProps  = {
  fontSize: "3rem",
};