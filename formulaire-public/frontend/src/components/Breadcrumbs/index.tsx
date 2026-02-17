import { Box, EllipsisWithTooltip } from "@cgi-learning-hub/ui";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { FC } from "react";

import { FORM_COLOR } from "~/core/style/colors";

import { StyledBreadCrumb, StyledBreadCrumbItemWrapper } from "./style";
import { IFormBreadcrumbsProps } from "./types";

export const FormBreadcrumbs: FC<IFormBreadcrumbsProps> = ({
  icon: Icon,
  items,
  separator = null,
  shouldNavigate = false,
  showCollapse,
}) => {
  const maxItemsBeforeCollaspse = 2;

  return (
    <StyledBreadCrumb
      separator={separator}
      maxItems={maxItemsBeforeCollaspse}
      itemsAfterCollapse={2}
      hasSeparator={separator != null}
      shouldEllipsis={items.length >= maxItemsBeforeCollaspse}
      sx={{
        "li:last-child": { flex: 1 },
      }}
    >
      <Box color={FORM_COLOR}>
        <Icon height="3rem"></Icon>
      </Box>
      {showCollapse ? <MoreHorizIcon /> : null}
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
            textColor={FORM_COLOR}
            shouldNavigate={shouldNavigate}
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
