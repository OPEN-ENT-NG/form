import { Box, styled } from "@cgi-learning-hub/ui";
import { ICreationLayoutWrapperProps } from "./types";
import { defaultViewWidth } from "~/core/constants";
import { blockProps } from "~/core/utils";

export const CreationLayoutWrapper = styled(Box, {
  shouldForwardProp: blockProps("headerHeight"),
})<ICreationLayoutWrapperProps>(({ headerHeight = 71 }) => ({
  display: "flex",
  width: defaultViewWidth,
  height: `calc(100% - ${headerHeight.toString()}px)`,
}));
