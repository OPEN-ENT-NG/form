import { Box, styled } from "@cgi-learning-hub/ui";
import { IOrganizationItemPreviewProps } from "./types";

export const OrganizationItemPreview = styled(Box, {
  shouldForwardProp: (prop) => prop !== "depth",
})<IOrganizationItemPreviewProps>(({ depth }) => ({
  marginLeft: depth * 4,
  opacity: 0.5,
}));
