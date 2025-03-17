import { Box, Button } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { HeaderProps } from "./types";
import { FormBreadcrumbs } from "../Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ButtonVariant } from "~/core/style/themeProps";
import { headerStyle } from "../Breadcrumbs/style";

export const Header: FC<HeaderProps> = ({
  stringItems,
  buttons,
  isCreationPage = false,
}) => {
  const { t } = useTranslation(FORMULAIRE);

  return (
    <Box sx={headerStyle}>
      <FormBreadcrumbs
        stringItems={stringItems}
        separator={<NavigateNextIcon sx={{ height: "2.4rem" }} />}
        isHeader
      />
      {isCreationPage && <Box>//TODO</Box>}
      <Box>
        {buttons.map((button) => {
          return (
            <Button
              key={button.title}
              variant={button.variant ?? ButtonVariant.CONTAINED}
              onClick={button.action}
              sx={{ marginLeft: "2rem" }}
            >
              {t(button.title)}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};
