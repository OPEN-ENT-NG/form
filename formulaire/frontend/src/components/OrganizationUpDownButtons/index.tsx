import { FC, useMemo } from "react";
import { IOrganizationUpDownButtonsProps } from "./types";
import { Box } from "@cgi-learning-hub/ui";
import { iconStyle, StyledIconButton, upDownButtonsContainerStyle } from "./style";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Direction } from "../OrganizationSortableItem/enum";
import { isQuestion, isSection } from "~/core/models/formElement/utils";

export const OrganizationUpDownButtons: FC<IOrganizationUpDownButtonsProps> = ({
  element,
  formElementsList,
  handleReorderClick = () => {},
}) => {
  const isElementSection = isSection(element);
  const isElementQuestion = isQuestion(element);

  // Determine visibility of arrows
  const showSectionArrows = useMemo(
    () => isElementQuestion && element.sectionPosition,
    [isElementQuestion, element, formElementsList],
  );
  const showUp = useMemo(
    () => !showSectionArrows && element.position && element.position > 1,
    [showSectionArrows, element, formElementsList],
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
              isSection={isElementSection}
              onClick={() => {
                handleReorderClick(element, formElementsList, Direction.UP);
              }}
            >
              <KeyboardArrowUpRoundedIcon sx={iconStyle} />
            </StyledIconButton>
          )}
          {!!showDown && (
            <StyledIconButton
              isSection={isElementSection}
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
