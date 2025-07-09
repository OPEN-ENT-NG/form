import { FC, useMemo } from "react";
import { IOrganizationUpDownButtonsProps } from "./types";
import { isFormElementSection } from "~/core/models/section/utils";
import { Box } from "@cgi-learning-hub/ui";
import { iconStyle, StyledIconButton, upDownButtonsContainerStyle } from "./style";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Direction } from "../OrganizationSortableItem/enum";
import { isFormElementQuestion } from "~/core/models/question/utils";
import { IQuestion } from "~/core/models/question/types";

export const OrganizationUpDownButtons: FC<IOrganizationUpDownButtonsProps> = ({
  element,
  formElementsList,
  handleReorderClick = () => {},
}) => {
  const isSection = isFormElementSection(element);
  const isQuestion = isFormElementQuestion(element);

  // Determine visibility of arrows
  const showSectionArrows = useMemo(() => isQuestion && (element as IQuestion).sectionPosition, [isQuestion, element]);
  const showUp = useMemo(
    () => !showSectionArrows && element.position && element.position > 1,
    [showSectionArrows, element],
  );
  const showDown = useMemo(
    () => !showSectionArrows && element.position && element.position < formElementsList.length,
    [showSectionArrows, element, formElementsList],
  );

  // Render only if any arrow should be shown
  if (!showSectionArrows && !showUp && !showDown) {
    return null;
  }

  return (
    <Box sx={upDownButtonsContainerStyle}>
      {showSectionArrows && (
        <>
          <StyledIconButton
            isSection={false}
            onClick={() => {
              handleReorderClick(element, formElementsList, Direction.UP);
            }}
          >
            <KeyboardArrowUpRoundedIcon sx={iconStyle} />
          </StyledIconButton>
          <StyledIconButton
            isSection={false}
            onClick={() => {
              handleReorderClick(element, formElementsList, Direction.DOWN);
            }}
          >
            <KeyboardArrowDownRoundedIcon sx={iconStyle} />
          </StyledIconButton>
        </>
      )}
      {!showSectionArrows && (
        <>
          {!!showUp && (
            <StyledIconButton
              isSection={isSection}
              onClick={() => {
                handleReorderClick(element, formElementsList, Direction.UP);
              }}
            >
              <KeyboardArrowUpRoundedIcon sx={iconStyle} />
            </StyledIconButton>
          )}
          {!!showDown && (
            <StyledIconButton
              isSection={isSection}
              onClick={() => {
                handleReorderClick(element, formElementsList, Direction.DOWN);
              }}
            >
              <KeyboardArrowDownRoundedIcon sx={iconStyle} />
            </StyledIconButton>
          )}
        </>
      )}
    </Box>
  );
};
