import { Box, Button } from "@cgi-learning-hub/ui";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant } from "~/core/style/themeProps";
import { useFormatDateWithTime } from "~/hook/useFormatDateWithTime";
import { useTheme } from "~/hook/useTheme";

import { Banner } from "../Banner";
import { FormBreadcrumbs } from "../Breadcrumbs";
import { FormsIcon } from "../SVG/FormsIcon";
import { headerButtonsStyle, headerStyle, leftBoxStyle, saveBoxStyle } from "./style";
import { IHeaderProps } from "./types";

export const Header: FC<IHeaderProps> = ({
  items,
  buttons,
  shouldNavigate = false,
  isCreationPage = false,
  displaySeparator = false,
  form = null,
}) => {
  const formatDateWithTime = useFormatDateWithTime();
  const { t } = useTranslation(FORMULAIRE);
  const { isTheme1D } = useTheme();
  const formDateModification = formatDateWithTime(form?.date_modification, "formulaire.form.edit.modified");

  return (
    <Box sx={headerStyle(isTheme1D)}>
      <Box sx={leftBoxStyle}>
        <FormBreadcrumbs
          icon={FormsIcon}
          items={items}
          separator={displaySeparator && <NavigateNextIcon sx={{ height: "2.4rem" }} />}
          isHeader
          shouldNavigate={shouldNavigate}
        />
        <Box sx={saveBoxStyle}>
          {isCreationPage && formDateModification && (
            <Banner icon={CheckCircleRoundedIcon} text={formDateModification} />
          )}
        </Box>
      </Box>
      <Box sx={headerButtonsStyle}>
        {buttons.map((button) => (
          <Button
            key={button.title}
            variant={button.variant ?? ComponentVariant.CONTAINED}
            onClick={() => {
              button.action();
            }}
            startIcon={button.startIcon}
          >
            {t(button.title)}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
