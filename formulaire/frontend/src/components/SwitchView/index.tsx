import { FC } from "react";

import { Box, Button } from "@cgi-learning-hub/ui";
import { SwitchViewProps } from "./types";
import { ComponentVariant } from "~/core/style/themeProps";
import { switchViewLeftItemStyle, switchViewRightItemStyle, switchViewStyle } from "./style";

export const SwitchView: FC<SwitchViewProps> = ({ isViewTable = false, onClick }) => {
  return (
    <Box sx={switchViewStyle}>
      <Button variant={isViewTable ? ComponentVariant.OUTLINED : ComponentVariant.CONTAINED} onClick={onClick} sx={switchViewLeftItemStyle}>
        Cards
      </Button>
      <Button variant={isViewTable ? ComponentVariant.CONTAINED : ComponentVariant.OUTLINED} onClick={onClick} sx={switchViewRightItemStyle}>
        Table
      </Button>
    </Box>
  );
};
