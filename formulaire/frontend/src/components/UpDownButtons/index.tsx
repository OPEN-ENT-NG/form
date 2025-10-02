import { FC, useMemo } from "react";
import { Box, IconButton } from "@cgi-learning-hub/ui";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Direction } from "../OrganizationSortableItem/enum";
import { IUpDownButtonsProps } from "./types";
import { upDownButtonsContainerStyle } from "../OrganizationUpDownButtons/style";
import { arrowWrapperStyle, iconStyle } from "./style";
import { ComponentSize } from "~/core/style/themeProps";

export const UpDownButtons: FC<IUpDownButtonsProps> = ({
  element,
  index,
  elementList,
  hasCustomAtTheEnd,
  handleReorderClick,
}) => {
  // Determine visibility of arrows
  const showUp = useMemo(() => index > 0 && (!hasCustomAtTheEnd || index < elementList.length - 1), [element]);

  const showDown = useMemo(
    () => index + (hasCustomAtTheEnd ? 2 : 1) < elementList.length,
    [element, elementList, index],
  );
  // Render only if any arrow should be shown
  if (!showUp && !showDown) {
    return null;
  }

  return (
    <Box sx={upDownButtonsContainerStyle}>
      <Box sx={arrowWrapperStyle}>
        {showUp && (
          <IconButton
            onClick={() => {
              handleReorderClick(index, Direction.UP);
            }}
            size={ComponentSize.SMALL}
          >
            <KeyboardArrowUpRoundedIcon sx={iconStyle} />
          </IconButton>
        )}
      </Box>
      <Box sx={arrowWrapperStyle}>
        {showDown && (
          <IconButton
            onClick={() => {
              handleReorderClick(index, Direction.DOWN);
            }}
            size={ComponentSize.SMALL}
          >
            <KeyboardArrowDownRoundedIcon sx={iconStyle} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
