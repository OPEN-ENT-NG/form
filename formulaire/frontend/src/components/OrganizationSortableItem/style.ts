import { IconButton, Paper, styled, SxProps } from "@cgi-learning-hub/ui";
import { IStyledPaperProps } from "./types";

export const OrganizationStyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isSection" && prop !== "depth" && prop !== "isPreview",
})<IStyledPaperProps>(({ theme, isSection, depth = 0, isPreview = false }) => ({
  display: "flex",
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(0.5, 1),
  backgroundColor: isSection ? theme.palette.secondary.main : theme.palette.background.paper,
  color: isSection ? theme.palette.primary.contrastText : theme.palette.text.primary,
  marginLeft: depth,
  opacity: isPreview ? 0.5 : 1,
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

export const arrowIconStyle: SxProps = {
  fontSize: "3rem",
};

export const paperContentStyle: SxProps = {
  display: "flex",
  alignItems: "center",
};
