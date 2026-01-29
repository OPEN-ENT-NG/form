import { Box, EllipsisWithTooltip, IconButton } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { getHomePath } from "~/core/pathHelper";
import { FORM_COLOR, GREY_DARKER_COLOR } from "~/core/style/colors";
import { CSS_TEXT_PRIMARY_COLOR } from "~/core/style/cssColors";

import { StyledBreadCrumb, StyledBreadCrumbItemWrapper } from "./style";
import { IFormBreadcrumbsProps } from "./types";

export const FormBreadcrumbs: FC<IFormBreadcrumbsProps> = ({
  icon: Icon,
  items,
  separator = null,
  isHeader = false,
  shouldNavigate = false,
}) => {
  const textColor = isHeader ? FORM_COLOR : CSS_TEXT_PRIMARY_COLOR;
  const navigate = useNavigate();
  const maxItemsBeforeCollaspse = 3;

  return (
    <StyledBreadCrumb
      separator={separator}
      maxItems={maxItemsBeforeCollaspse}
      itemsAfterCollapse={2}
      hasSeparator={separator != null}
      shouldEllipsis={items.length >= maxItemsBeforeCollaspse}
    >
      {isHeader ? (
        <IconButton component={RouterLink} to={getHomePath()} disableRipple sx={{ flexShrink: 0, color: FORM_COLOR }}>
          <Icon height="3rem" width="3rem"></Icon>
        </IconButton>
      ) : (
        <Box color={GREY_DARKER_COLOR}>
          <Icon height="2.3rem"></Icon>
        </Box>
      )}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const shouldEllipsis = isLast && items.length >= maxItemsBeforeCollaspse;
        const content = shouldEllipsis ? (
          <EllipsisWithTooltip slotProps={{ text: { fontSize: "2.4rem" } }}>{item}</EllipsisWithTooltip>
        ) : (
          item
        );
        return (
          <StyledBreadCrumbItemWrapper
            key={index}
            textColor={textColor}
            isHeader={isHeader}
            shouldNavigate={shouldNavigate}
            hasSeparator={separator != null}
            isLast={isLast}
            onClick={() => {
              if (isHeader && shouldNavigate) navigate(getHomePath());
            }}
          >
            {content}
          </StyledBreadCrumbItemWrapper>
        );
      })}
    </StyledBreadCrumb>
  );
};
