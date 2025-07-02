import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { isFormElementQuestion } from "~/core/models/question/utils";
import { Box } from "@cgi-learning-hub/ui";
import { arrowIconStyle, StyledIconButton } from "./style";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { isFormElementSection } from "~/core/models/section/utils";
import { Direction } from "./enum";

export const getUpDownButtons = (
  element: IFormElement,
  formElementsList: IFormElement[],
  handleReorderClick: (element: IFormElement, formElementList: IFormElement[], direction: Direction) => void,
) => {
  const isSection = isFormElementSection(element);
  if (isFormElementQuestion(element)) {
    const question = element as IQuestion;
    if (question.sectionPosition) {
      return (
        <Box sx={{ display: "flex" }}>
          <StyledIconButton
            isSection={isSection}
            onClick={() => {
              handleReorderClick(element, formElementsList, Direction.UP);
            }}
          >
            <KeyboardArrowUpRoundedIcon sx={arrowIconStyle} />
          </StyledIconButton>
          <StyledIconButton
            isSection={isSection}
            onClick={() => {
              handleReorderClick(element, formElementsList, Direction.DOWN);
            }}
          >
            <KeyboardArrowDownRoundedIcon sx={arrowIconStyle} />
          </StyledIconButton>
        </Box>
      );
    }
  }

  if (!element.position) return null;

  const max = formElementsList.length;
  return (
    <Box sx={{ display: "flex" }}>
      {element.position > 1 && (
        <StyledIconButton
          isSection={isSection}
          onClick={() => {
            handleReorderClick(element, formElementsList, Direction.UP);
          }}
        >
          <KeyboardArrowUpRoundedIcon sx={arrowIconStyle} />
        </StyledIconButton>
      )}
      {element.position < max && (
        <StyledIconButton
          isSection={isSection}
          onClick={() => {
            handleReorderClick(element, formElementsList, Direction.DOWN);
          }}
        >
          <KeyboardArrowDownRoundedIcon sx={arrowIconStyle} />
        </StyledIconButton>
      )}
    </Box>
  );
};
