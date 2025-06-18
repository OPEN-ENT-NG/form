import { styled, SxProps, Typography } from "@cgi-learning-hub/ui";
import { IBreadCrumbItemWrapperProps } from "./types";

export const BreadCrumbItemWrapper = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "textColor" && prop !== "isHeader" && prop !== "hasSeparator",
})<IBreadCrumbItemWrapperProps>(({ textColor, isHeader, hasSeparator }) => ({
  color: textColor,
  fontSize: isHeader ? "2.4rem" : "2rem",
  marginLeft: hasSeparator ? "-1rem" : "",
  ...(isHeader && {
    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  }),
}));

export const separatorStyle: SxProps = {
  "& .MuiBreadcrumbs-separator": {
    marginLeft: 0,
    marginRight: 0,
  },
};
