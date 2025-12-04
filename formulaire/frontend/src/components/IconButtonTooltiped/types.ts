import { SxProps, Theme } from "@cgi-learning-hub/ui";
import { ReactNode } from "react";

export interface IIconButtonTooltipedProps {
  icon: ReactNode;
  onClick: () => void;
  tooltipI18nKey: string;
  ariaLabel: string;
  arrow?: boolean;
  disableInteractive?: boolean;
  disabled?: boolean;
  slotProps?: {
    tooltip?: SxProps<Theme>;
    iconButton?: SxProps<Theme>;
  };
}
