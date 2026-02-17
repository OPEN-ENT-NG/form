import { Box } from "@cgi-learning-hub/ui";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FC } from "react";

import { useTheme } from "~/hook/useTheme";

import { FormBreadcrumbs } from "../Breadcrumbs";
import { FormsIcon } from "../SVG/FormsIcon";
import { headerStyle, leftBoxStyle } from "./style";
import { IHeaderProps } from "./types";

export const Header: FC<IHeaderProps> = ({ items, shouldNavigate = false, displaySeparator = false, showCollapse }) => {
  const { isTheme1D } = useTheme();

  return (
    <Box sx={headerStyle(isTheme1D)}>
      <Box sx={leftBoxStyle}>
        <FormBreadcrumbs
          icon={FormsIcon}
          items={items}
          separator={displaySeparator && <NavigateNextIcon sx={{ height: "2.4rem" }} />}
          shouldNavigate={shouldNavigate}
          showCollapse={showCollapse}
        />
      </Box>
    </Box>
  );
};
