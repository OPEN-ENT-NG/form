import { FC } from "react";

import { ToggleButton, ToggleButtonGroup } from "@cgi-learning-hub/ui";
import { SwitchViewProps } from "./types";
import { switchViewStyle, switchViewItemStyle } from "./style";
import { ViewMode } from "./enums";

export const SwitchView: FC<SwitchViewProps> = ({ viewMode = ViewMode.CARDS, toggleButtonList, onChange }) => {
  return (
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={(event, value) => onChange(value)}
      size="small"
      sx={switchViewStyle}
    >
      {toggleButtonList.map((button) => (
        <ToggleButton key={button.value} value={button.value} sx={switchViewItemStyle}>
          {button.icon}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
