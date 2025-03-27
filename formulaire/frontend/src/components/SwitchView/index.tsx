import { FC } from "react";

import { Box, Button } from "@cgi-learning-hub/ui";
import { SwitchViewProps } from "./types";
import { ComponentVariant } from "~/core/style/themeProps";
import { switchViewLeftItemStyle, switchViewRightItemStyle, switchViewStyle } from "./style";
import AppsIcon from "@mui/icons-material/Apps";
import ListIcon from "@mui/icons-material/List";

export const SwitchView: FC<SwitchViewProps> = ({ isViewTable = false, onClick }) => {
  return (
    <Box sx={switchViewStyle}>
      <Button
        variant={isViewTable ? ComponentVariant.OUTLINED : ComponentVariant.CONTAINED}
        onClick={onClick}
        sx={switchViewLeftItemStyle}
      >
        <AppsIcon></AppsIcon>
      </Button>
      <Button
        variant={isViewTable ? ComponentVariant.CONTAINED : ComponentVariant.OUTLINED}
        onClick={onClick}
        sx={switchViewRightItemStyle}
      >
        <ListIcon></ListIcon>
      </Button>
    </Box>
  );
};
