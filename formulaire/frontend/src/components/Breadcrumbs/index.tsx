import { FC } from "react";

import { IFormBreadcrumbsProps } from "./types";
import { Breadcrumbs } from "@mui/material";
import { Box, EllipsisWithTooltip, Link } from "@cgi-learning-hub/ui";
import { FORM_COLOR, GREY_DARKER_COLOR } from "~/core/style/colors";
import { FORMULAIRE } from "~/core/constants";
import { StyledBreadCrumbItemWrapper, ellipsisStyle, separatorStyle } from "./style";
import { useNavigate } from "react-router-dom";
import { CSS_TEXT_PRIMARY_COLOR } from "~/core/style/cssColors";

export const FormBreadcrumbs: FC<IFormBreadcrumbsProps> = ({
  icon: Icon,
  stringItems,
  separator = null,
  isHeader = false,
}) => {
  const textColor = isHeader ? FORM_COLOR : CSS_TEXT_PRIMARY_COLOR;
  const navigate = useNavigate();

  return (
    <Breadcrumbs
      separator={separator}
      maxItems={3}
      itemsAfterCollapse={2}
      sx={separator ? separatorStyle : ellipsisStyle}
    >
      {isHeader ? (
        <Link underline="hover" color={FORM_COLOR} href={`/${FORMULAIRE}`} sx={{ flexShrink: 0 }}>
          <Icon height="3rem" width="3rem"></Icon>
        </Link>
      ) : (
        <Box color={GREY_DARKER_COLOR}>
          <Icon height="2.3rem"></Icon>
        </Box>
      )}
      {stringItems.map((stringItem, index) => {
        const isLast = index === stringItems.length - 1;
        return (
          <StyledBreadCrumbItemWrapper
            key={stringItem}
            textColor={textColor}
            isHeader={isHeader}
            hasSeparator={!separator}
            isLast={isLast}
            onClick={() => {
              if (isHeader) navigate("/");
            }}
          >
            <EllipsisWithTooltip typographyProps={{ fontSize: "2.4rem" }}>{stringItem}</EllipsisWithTooltip>
          </StyledBreadCrumbItemWrapper>
        );
      })}
    </Breadcrumbs>
  );
};
