import { Box, styled } from "@cgi-learning-hub/ui";

import { defaultViewMaxWidth } from "~/core/constants";
import { blockProps } from "~/core/utils";

import { ICreationLayoutWrapperProps } from "./types";

export const CreationLayoutWrapper = styled(Box, {
  shouldForwardProp: blockProps("headerHeight"),
})<ICreationLayoutWrapperProps>(({ headerHeight = 71 }) => ({
  display: "flex",
  width: "100%",
  maxWidth: defaultViewMaxWidth,
  height: `calc(100% - ${headerHeight.toString()}px)`,
}));
