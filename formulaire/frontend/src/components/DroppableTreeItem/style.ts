import { Box, styled } from "@cgi-learning-hub/ui";

import { IStyledDroppableTreeItemProps } from "./types";

export const StyledDroppableTreeItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "rect" && prop !== "isOverDroppable",
})<IStyledDroppableTreeItemProps>(({ rect, isOverDroppable }) => ({
  position: "absolute",
  top: rect.top + window.scrollY,
  left: rect.left + window.scrollX,
  width: rect.width,
  height: rect.height,
  pointerEvents: "none",
  backgroundColor: isOverDroppable ? "var(--theme-palette-action-hover)" : "transparent",
}));
