import { IconButton, Tooltip } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { t } from "~/i18n";

import { IIconButtonTooltipedProps } from "./types";

export const IconButtonTooltiped: FC<IIconButtonTooltipedProps> = ({
  icon,
  onClick,
  tooltipI18nKey,
  ariaLabel,
  arrow = false,
  disableInteractive = true,
  disabled = false,
  slotProps = {},
}) => {
  return (
    <Tooltip
      title={t(tooltipI18nKey)}
      placement="top"
      disableInteractive={disableInteractive}
      arrow={arrow}
      sx={slotProps.tooltip}
    >
      <IconButton aria-label={ariaLabel} onClick={onClick} disabled={disabled} sx={slotProps.iconButton}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};
