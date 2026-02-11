import { Box, styled, SxProps, Theme } from "@cgi-learning-hub/ui";

import { searchStyle } from "~/containers/home/HomeMainLayout/style";
import { spaceBetweenBoxStyle } from "~/core/style/boxStyles";
import { blockProps } from "~/core/utils";

import { IMyAnswerHeaderWrapperProps } from "./types";

export const StyledMyAnswerHeaderWrapper = styled(Box, {
  shouldForwardProp: blockProps("isMobile"),
})<IMyAnswerHeaderWrapperProps>(({ isMobile = false }) => ({
  ...spaceBetweenBoxStyle,
  gap: isMobile ? "1rem" : "2rem",
  ...(isMobile ? { flexDirection: "column" } : { padding: "0 5rem 0 0", height: "3.5rem" }),
}));

export const tabStyle: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  flexShrink: 0,
  width: "319px",
};

export const myAnswerSearchStyle: SxProps<Theme> = {
  ...searchStyle,
  padding: "0 0 0 calc(1rem + 1px)",
};
