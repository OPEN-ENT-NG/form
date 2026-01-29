import { Box, EllipsisWithTooltip, Link } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { FORM_COLOR, GREY_DARKER_COLOR } from "~/core/style/colors";
import { CSS_TEXT_PRIMARY_COLOR } from "~/core/style/cssColors";

import { StyledBreadCrumb, StyledBreadCrumbItemWrapper } from "./style";
import { IFormBreadcrumbsProps } from "./types";

export const FormBreadcrumbs: FC<IFormBreadcrumbsProps> = ({
  icon: Icon,
  stringItems,
  separator = null,
  isHeader = false,
  isCreationPage = false,
}) => {
  const textColor = isHeader ? FORM_COLOR : CSS_TEXT_PRIMARY_COLOR;
  const maxItemsBeforeCollaspse = 3;

  return (
    <StyledBreadCrumb
      separator={separator}
      maxItems={maxItemsBeforeCollaspse}
      itemsAfterCollapse={2}
      hasSeparator={separator != null}
      shouldEllipsis={stringItems.length >= maxItemsBeforeCollaspse}
    >
      {isHeader ? (
        <Link underline="hover" color={FORM_COLOR} sx={{ flexShrink: 0 }}>
          <Icon height="3rem" width="3rem"></Icon>
        </Link>
      ) : (
        <Box color={GREY_DARKER_COLOR}>
          <Icon height="2.3rem"></Icon>
        </Box>
      )}
      {stringItems.map((stringItem, index) => {
        const isLast = index === stringItems.length - 1;
        const shouldEllipsis = isLast && stringItems.length >= maxItemsBeforeCollaspse;
        const content = shouldEllipsis ? (
          <EllipsisWithTooltip slotProps={{ text: { fontSize: "2.4rem" } }}>{stringItem}</EllipsisWithTooltip>
        ) : (
          stringItem
        );
        return (
          <StyledBreadCrumbItemWrapper
            key={stringItem}
            textColor={textColor}
            isHeader={isHeader}
            isCreationPage={isCreationPage}
            hasSeparator={separator != null}
            isLast={isLast}
          >
            {content}
          </StyledBreadCrumbItemWrapper>
        );
      })}
    </StyledBreadCrumb>
  );
};
