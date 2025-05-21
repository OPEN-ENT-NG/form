import { Box, styled } from "@cgi-learning-hub/ui";
import { ICreationLayoutWrapperProps } from "./types";

export const CreationLayoutWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "headerHeight",
})<ICreationLayoutWrapperProps>(({ headerHeight = 71 }) => ({
  display: "flex",
  width: "100%",
  height: `calc(100% - ${headerHeight.toString()}px)`,
}));
