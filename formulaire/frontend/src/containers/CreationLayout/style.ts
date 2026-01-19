import { Box, styled, SxProps, Theme } from "@cgi-learning-hub/ui";
import { ICreationLayoutWrapperProps } from "./types";
import { defaultViewMaxWidth } from "~/core/constants";

export const CreationLayoutWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "headerHeight",
})<ICreationLayoutWrapperProps>(({ headerHeight = 71 }) => ({
  display: "flex",
  width: "100%",
  maxWidth: defaultViewMaxWidth,
  height: `calc(100% - ${headerHeight.toString()}px)`,
}));

export const emptyStateWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  gap: 3,
};
