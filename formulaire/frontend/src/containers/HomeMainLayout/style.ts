import { Box, styled, SxProps, Theme } from "@cgi-learning-hub/ui";

import { spaceBetweenBoxStyle } from "~/core/style/boxStyles";
import { blockProps } from "~/core/utils";

import { IMainContentInnerWrapperProps } from "./types";

export const StyledMainContentInnerWrapper = styled(Box, {
  shouldForwardProp: blockProps("isMobile", "dragCursorStyle"),
})<IMainContentInnerWrapperProps>(({ isMobile = false, dragCursorStyle = null }) => ({
  height: "100%",
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
  gap: !isMobile ? "3rem" : "1rem",
  paddingTop: !isMobile ? "2rem" : "1rem",
  boxSizing: "border-box",
  width: "100%",
  ...dragCursorStyle,
}));

export const searchStyle: SxProps<Theme> = {
  ...spaceBetweenBoxStyle,
  gap: "2rem",
  height: "3.5rem",
  padding: "0 5rem 0 3rem",
};

export const viewTitleStyle: SxProps<Theme> = {
  ...searchStyle,
  paddingTop: "1rem",
};

export const resourceContainerStyle: SxProps<Theme> = {
  overflowY: "auto",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: " 1rem 3rem 2rem 3rem",
  width: "100%",
  gap: "4rem",
  boxSizing: "border-box",
};

export const searchBarStyle: SxProps<Theme> = {
  width: "100%",
};

export const emptyStateWrapperStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2rem",
};
