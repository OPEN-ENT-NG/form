import { Breadcrumbs, styled, Typography } from "@cgi-learning-hub/ui";

import { blockProps } from "~/core/utils";

import { IBreadCrumbItemWrapperProps, IBreadCrumbProps } from "./types";

export const StyledBreadCrumbItemWrapper = styled(Typography, {
  shouldForwardProp: blockProps("textColor", "isHeader", "shouldNavigate", "hasSeparator", "isLast"),
})<IBreadCrumbItemWrapperProps>(({ textColor, isHeader, shouldNavigate, hasSeparator, isLast }) => ({
  color: textColor,
  fontSize: isHeader ? "2.4rem" : "2rem",
  marginLeft: hasSeparator ? "" : "-1rem",
  ...(isLast && {
    flexShrink: 1,
    minWidth: 0,
  }),
  ...(!isLast && {
    flexShrink: 0,
  }),
  ...(isHeader &&
    shouldNavigate && {
      "&:hover": {
        cursor: "pointer",
        textDecoration: "underline",
      },
    }),
}));

export const StyledBreadCrumb = styled(Breadcrumbs, {
  shouldForwardProp: blockProps("hasSeparator", "shouldEllipsis"),
})<IBreadCrumbProps>(({ hasSeparator, shouldEllipsis }) => ({
  ...(shouldEllipsis && {
    "& .MuiBreadcrumbs-li:last-of-type": {
      flexShrink: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  }),
  "& .MuiBreadcrumbs-ol": {
    flexWrap: "nowrap",
  },
  "& .MuiBreadcrumbs-li": {
    flexShrink: 0,
  },
  ...(hasSeparator && {
    "& .MuiBreadcrumbs-separator": {
      marginLeft: 0,
      marginRight: 0,
    },
  }),
}));
