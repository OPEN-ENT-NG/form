import { FC } from "react";

import { FormBreadcrumbsProps } from "./types";
import { Breadcrumbs } from "@mui/material";
import { Box, Link, Typography } from "@cgi-learning-hub/ui";
import { FormsIcon } from "../SVG/FormsIcon";
import {
  FORM_COLOR,
  GREY_DARKER_COLOR,
  TEXT_PRIMARY_COLOR,
} from "~/core/style/colors";

export const FormBreadcrumbs: FC<FormBreadcrumbsProps> = ({
  stringItems,
  separator = null,
  isHeader = false,
  displaySeparator = false,
}) => {
  return (
    <Breadcrumbs
      separator={displaySeparator && (separator ?? null)}
      maxItems={3}
    >
      {isHeader ? (
        <Link underline="hover" color={FORM_COLOR} href="/">
          <FormsIcon height="5rem" />
        </Link>
      ) : (
        <Box color={GREY_DARKER_COLOR}>
          <FormsIcon height="2.3rem" />
        </Box>
      )}
      {stringItems.map((stringItem) => (
        <Typography
          key={stringItem}
          color={isHeader ? FORM_COLOR : TEXT_PRIMARY_COLOR}
          fontSize={isHeader ? "2.4rem" : "2rem"}
          marginLeft={separator === null || !displaySeparator ? "-1rem" : ""}
        >
          {stringItem}
        </Typography>
      ))}
    </Breadcrumbs>
  );
};
