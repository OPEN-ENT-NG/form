import { Box, Button } from "@cgi-learning-hub/ui";
import { FC } from "react";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant } from "~/core/style/themeProps";
import { useFormatDateWithTime } from "~/hook/useFormatDateWithTime";
import { Banner } from "../Banner";
import { FormBreadcrumbs } from "../Breadcrumbs";
import { FormsIcon } from "../SVG/FormsIcon";
import { headerButtonsStyle, headerStyle } from "./style";
import { IHeaderProps } from "./types";

export const Header: FC<IHeaderProps> = ({
  items,
  buttons,
  isCreationPage = false,
  displaySeparator = false,
  form = null,
}) => {
  const formatDateWithTime = useFormatDateWithTime();
  const { t } = useTranslation(FORMULAIRE);
  const formDateModification = formatDateWithTime(form?.date_modification, "formulaire.form.edit.modified");

  return (
    <Box sx={headerStyle}>
      <FormBreadcrumbs
        icon={FormsIcon}
        items={items}
        separator={displaySeparator && <NavigateNextIcon sx={{ height: "2.4rem" }} />}
        isHeader
        isCreationPage={isCreationPage}
      />
      <Box sx={headerButtonsStyle}>
        {isCreationPage && formDateModification && <Banner icon={CheckCircleRoundedIcon} text={formDateModification} />}
        {buttons.map((button) => (
          <Button
            key={button.title}
            variant={button.variant ?? ComponentVariant.CONTAINED}
            onClick={() => {
              button.action();
            }}
            startIcon={button.startIcon}
            sx={{ marginLeft: "1.5rem" }}
          >
            {t(button.title)}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
