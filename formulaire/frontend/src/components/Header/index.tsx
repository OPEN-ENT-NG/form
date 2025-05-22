import { Box, Button } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { IHeaderProps } from "./types";
import { FormBreadcrumbs } from "../Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { headerButtonsStyle, headerStyle } from "./style";
import { ComponentVariant } from "~/core/style/themeProps";
import { FormsIcon } from "../SVG/FormsIcon";

export const Header: FC<IHeaderProps> = ({
  stringItems,
  buttons,
  isCreationPage = false,
  displaySeparator = false,
}) => {
  const { t } = useTranslation(FORMULAIRE);

  return (
    <Box sx={headerStyle}>
      <FormBreadcrumbs
        icon={FormsIcon}
        stringItems={stringItems}
        separator={displaySeparator && <NavigateNextIcon sx={{ height: "2.4rem" }} />}
        isHeader
      />
      {isCreationPage && <Box>//TODO</Box>}
      <Box sx={headerButtonsStyle}>
        {buttons.map((button) => (
          <Button
            key={button.titleI18nkey}
            variant={button.variant ?? ComponentVariant.CONTAINED}
            onClick={() => {
              button.action();
            }}
            startIcon={button.startIcon}
            sx={{ marginLeft: "2rem" }}
          >
            {t(button.titleI18nkey)}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
