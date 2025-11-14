import { FC } from "react";

import { IFormBreadcrumbsProps } from "./types";
import { Box, EllipsisWithTooltip, Link } from "@cgi-learning-hub/ui";
import { FORM_COLOR, GREY_DARKER_COLOR } from "~/core/style/colors";
import { FORMULAIRE } from "~/core/constants";
import { StyledBreadCrumb, StyledBreadCrumbItemWrapper } from "./style";
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
            hasSeparator={separator != null}
            isLast={isLast}
            onClick={() => {
              if (isHeader) navigate("/");
            }}
          >
            {content}
          </StyledBreadCrumbItemWrapper>
        );
      })}
    </StyledBreadCrumb>
  );
};
