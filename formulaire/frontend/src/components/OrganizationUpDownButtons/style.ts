import { IconButton, styled, SxProps } from "@cgi-learning-hub/ui";

import { IStyledPaperProps } from "../OrganizationSortableItem/types";

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "isSection",
})<IStyledPaperProps>(({ theme, isSection }) => ({
  padding: 0,
  color: isSection ? theme.palette.primary.contrastText : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: isSection ? theme.palette.secondary.dark : theme.palette.action.hover,
  },
}));

export const upDownButtonsContainerStyle: SxProps = {
  display: "flex",
};

export const iconStyle: SxProps = {
  fontSize: "3rem",
};
