import { ToggleButton, ToggleButtonGroup } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { ViewMode } from "./enums";
import { switchViewItemStyle, switchViewStyle } from "./style";
import { ISwitchViewProps } from "./types";

export const SwitchView: FC<ISwitchViewProps> = ({ viewMode, toggleButtonList, onChange }) => {
  return (
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={(event, value: ViewMode) => {
        onChange(value);
      }}
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
