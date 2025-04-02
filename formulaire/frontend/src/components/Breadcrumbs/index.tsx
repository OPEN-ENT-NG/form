import { FC } from "react";

import { FormBreadcrumbsProps } from "./types";
import { Breadcrumbs } from "@mui/material";
import { Box, Link } from "@cgi-learning-hub/ui";
import { FormsIcon } from "../SVG/FormsIcon";
import { FORM_COLOR, GREY_DARKER_COLOR, TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { FORMULAIRE } from "~/core/constants";
import { BreadCrumbItemWrapper } from "./style";
import { useNavigate } from "react-router-dom";

export const FormBreadcrumbs: FC<FormBreadcrumbsProps> = ({ stringItems, separator = null, isHeader = false }) => {
  const textColor = isHeader ? FORM_COLOR : TEXT_PRIMARY_COLOR;
  const navigate = useNavigate();

  return (
    <Breadcrumbs separator={separator} maxItems={3}>
      {isHeader ? (
        <Link underline="hover" color={FORM_COLOR} href={`/${FORMULAIRE}`}>
          <FormsIcon height="5rem" />
        </Link>
      ) : (
        <Box color={GREY_DARKER_COLOR}>
          <FormsIcon height="2.3rem" />
        </Box>
      )}
      {stringItems.map((stringItem) => (
        <BreadCrumbItemWrapper
          key={stringItem}
          textColor={textColor}
          isHeader={isHeader}
          hasSeparator={!separator}
          onClick={() => {
            navigate("/");
          }}
        >
          {stringItem}
        </BreadCrumbItemWrapper>
      ))}
    </Breadcrumbs>
  );
};
