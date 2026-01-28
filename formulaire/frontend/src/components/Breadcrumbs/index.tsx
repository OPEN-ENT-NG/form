import { Box, EllipsisWithTooltip, Link } from "@cgi-learning-hub/ui";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { FORMULAIRE } from "~/core/constants";
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
  isCreationPage = false,
  showCollapse,
}) => {
  const textColor = isHeader ? FORM_COLOR : CSS_TEXT_PRIMARY_COLOR;
  const navigate = useNavigate();
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
      {isHeader ? (
        <Link underline="hover" color={FORM_COLOR} href={`/${FORMULAIRE}`} sx={{ flexShrink: 0 }}>
          <Icon height="3rem" width="3rem"></Icon>
        </Link>
      ) : (
        <Box color={GREY_DARKER_COLOR}>
          <Icon height="2.3rem"></Icon>
        </Box>
      )}
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
            textColor={textColor}
            isHeader={isHeader}
            isCreationPage={isCreationPage}
            hasSeparator={separator != null}
            isLast={isLast}
            onClick={() => {
              if (isHeader && !isCreationPage) navigate(getHomePath());
            }}
          >
            {content}
          </StyledBreadCrumbItemWrapper>
        );
      })}
    </StyledBreadCrumb>
  );
};
