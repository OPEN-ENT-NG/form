import { FC, useMemo } from "react";
import { Box, IconButton } from "@cgi-learning-hub/ui";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Direction } from "../OrganizationSortableItem/enum";
import { IQuestionChoicesUpDownButtonsProps } from "./types";
import { upDownButtonsContainerStyle } from "../OrganizationUpDownButtons/style";
import { arrowWrapperStyle, iconStyle } from "./style";
import { ComponentSize } from "~/core/style/themeProps";

export const QuestionChoicesUpDownButtons: FC<IQuestionChoicesUpDownButtonsProps> = ({
  choice,
  index,
  questionChoicesList,
  handleReorderClick,
}) => {
  // Determine visibility of arrows
  const showUp = useMemo(() => choice.position > 1 && !choice.isCustom, [choice]);

  const showDown = useMemo(
    () => choice.position < questionChoicesList.length && !questionChoicesList[index + 1].isCustom,
    [choice, questionChoicesList],
  );
  // Render only if any arrow should be shown
  if (!showUp && !showDown) {
    return null;
  }

  return (
    <Box sx={upDownButtonsContainerStyle}>
      <Box sx={arrowWrapperStyle}>
        {!!showUp && (
          <IconButton
            onClick={() => {
              handleReorderClick(choice, Direction.UP);
            }}
            size={ComponentSize.SMALL}
          >
            <KeyboardArrowUpRoundedIcon sx={iconStyle} />
          </IconButton>
        )}
      </Box>
      <Box sx={arrowWrapperStyle}>
        {!!showDown && (
          <IconButton
            onClick={() => {
              handleReorderClick(choice, Direction.DOWN);
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
