import { Paper, styled } from "@cgi-learning-hub/ui";
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
  backgroundColor: isSection ? theme.palette.primary.main : theme.palette.background.paper,
  color: isSection ? theme.palette.primary.contrastText : theme.palette.text.primary,
}));

export const dragIconStyle = {
  fontSize: "3rem",
};
