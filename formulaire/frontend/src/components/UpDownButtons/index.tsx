import { Box, IconButton } from "@cgi-learning-hub/ui";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { FC, useMemo } from "react";

import { hasFormResponses } from "~/core/models/form/utils";
import { ComponentSize } from "~/core/style/themeProps";
import { useCreation } from "~/providers/CreationProvider";

import { Direction } from "../OrganizationSortableItem/enum";
import { upDownButtonsContainerStyle } from "../OrganizationUpDownButtons/style";
import { arrowWrapperStyle, iconStyle } from "./style";
import { IUpDownButtonsProps } from "./types";

export const UpDownButtons: FC<IUpDownButtonsProps> = ({
  element,
  index,
  elementList,
  hasCustomAtTheEnd,
  handleReorderClick,
}) => {
  const { form } = useCreation();
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
            onClick={(e) => {
              e.stopPropagation();
              handleReorderClick(index, Direction.UP);
            }}
            size={ComponentSize.SMALL}
            disabled={!form || hasFormResponses(form)}
          >
            <KeyboardArrowUpRoundedIcon sx={iconStyle} />
          </IconButton>
        )}
      </Box>
      <Box sx={arrowWrapperStyle}>
        {showDown && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleReorderClick(index, Direction.DOWN);
            }}
            size={ComponentSize.SMALL}
            disabled={!form || hasFormResponses(form)}
          >
            <KeyboardArrowDownRoundedIcon sx={iconStyle} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
