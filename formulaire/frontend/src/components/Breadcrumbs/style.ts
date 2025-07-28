import { styled, SxProps, Typography } from "@cgi-learning-hub/ui";
import { IBreadCrumbItemWrapperProps } from "./types";
import { blockProps } from "~/core/utils";

export const StyledBreadCrumbItemWrapper = styled(Typography, {
  shouldForwardProp: blockProps("textColor", "isHeader", "hasSeparator", "isLast"),
})<IBreadCrumbItemWrapperProps>(({ textColor, isHeader, hasSeparator, isLast }) => ({
  color: textColor,
  fontSize: isHeader ? "2.4rem" : "2rem",
  marginLeft: hasSeparator ? "-1rem" : "",
  ...(isLast && {
    flexShrink: 1,
    minWidth: 0,
  }),
  ...(!isLast && {
    flexShrink: 0,
  }),
  ...(isHeader && {
    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  }),
}));

export const ellipsisStyle: SxProps = {
  "& .MuiBreadcrumbs-ol": {
    flexWrap: "nowrap",
  },
  "& .MuiBreadcrumbs-li": {
    flexShrink: 0,
  },
  "& .MuiBreadcrumbs-li:last-of-type": {
    flexShrink: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

export const separatorStyle: SxProps = {
  ...ellipsisStyle,
  "& .MuiBreadcrumbs-separator": {
    marginLeft: 0,
    marginRight: 0,
  },
};
