import { Box, EllipsisWithTooltip, IconButton } from "@cgi-learning-hub/ui";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { FRONT_ROUTES } from "~/core/frontRoutes";
import { FORM_COLOR, GREY_DARKER_COLOR } from "~/core/style/colors";
import { CSS_TEXT_PRIMARY_COLOR } from "~/core/style/cssColors";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";

import { StyledBreadCrumb, StyledBreadCrumbItemWrapper } from "./style";
import { IFormBreadcrumbsProps } from "./types";

export const FormBreadcrumbs: FC<IFormBreadcrumbsProps> = ({
  icon: Icon,
  items,
  separator = null,
  isHeader = false,
  shouldNavigate = false,
  showCollapse,
}) => {
  const textColor = isHeader ? FORM_COLOR : CSS_TEXT_PRIMARY_COLOR;
  const { navigateToHome } = useFormulaireNavigation();
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
        <IconButton
          component={RouterLink}
          to={FRONT_ROUTES.home.build()}
          disableRipple
          sx={{ flexShrink: 0, color: FORM_COLOR }}
        >
          <Icon height="3rem" width="3rem"></Icon>
        </IconButton>
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
            shouldNavigate={shouldNavigate}
            hasSeparator={separator != null}
            isLast={isLast}
            onClick={() => {
              if (isHeader && shouldNavigate) navigateToHome();
            }}
          >
            {content}
          </StyledBreadCrumbItemWrapper>
        );
      })}
    </StyledBreadCrumb>
  );
};
