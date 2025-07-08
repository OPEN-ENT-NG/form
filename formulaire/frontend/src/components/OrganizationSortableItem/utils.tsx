import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { isFormElementQuestion } from "~/core/models/question/utils";
import { Box } from "@cgi-learning-hub/ui";
import { arrowIconStyle, StyledIconButton, upDownButtonsContainerStyle } from "./style";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { isFormElementSection } from "~/core/models/section/utils";
import { Direction } from "./enum";
import {
  fixListPositions,
  getFollowingFormElement,
  getPreviousFormElement,
  removeFormElementFromList,
  updateElementInList,
} from "~/providers/CreationProvider/utils";
import { ISection } from "~/core/models/section/types";
import { PositionActionType } from "~/providers/CreationProvider/enum";
import { compareFormElements } from "~/core/models/formElement/utils";

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
        <Box sx={upDownButtonsContainerStyle}>
          <StyledIconButton
            isSection={false}
            onClick={() => {
              handleReorderClick(element, formElementsList, Direction.UP);
            }}
          >
            <KeyboardArrowUpRoundedIcon sx={arrowIconStyle} />
          </StyledIconButton>
          <StyledIconButton
            isSection={false}
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
    <Box sx={upDownButtonsContainerStyle}>
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

export const swapFormElements = (
  elementA: IFormElement,
  elementB: IFormElement,
  formElementsList: IFormElement[],
): IFormElement[] => {
  const bothQuestions = isFormElementQuestion(elementA) && isFormElementQuestion(elementB);

  // If both are questions
  if (bothQuestions) {
    const questionA = elementA as IQuestion;
    const questionB = elementB as IQuestion;

    // in the same section, swap only their sectionPosition
    if (questionA.sectionId && questionB.sectionId && questionA.sectionId === questionB.sectionId) {
      return formElementsList.map((el) => {
        if (isFormElementQuestion(el)) {
          const q = el as IQuestion;
          if (q.id === questionA.id) {
            return { ...q, sectionPosition: questionB.sectionPosition };
          }
          if (q.id === questionB.id) {
            return { ...q, sectionPosition: questionA.sectionPosition };
          }
        }
        return el;
      });
    }

    //If one is a top level question and the other is in a section, we swap top level and parent section
    if (questionA.position && questionB.sectionId) {
      const parentBSection = formElementsList.find(
        (el) => isFormElementSection(el) && el.id === questionB.sectionId,
      ) as ISection | undefined;
      if (!parentBSection) return formElementsList;
      return swapFormElements(questionA, parentBSection, formElementsList);
    }

    if (questionA.sectionId && questionB.position) {
      const parentASection = formElementsList.find(
        (el) => isFormElementSection(el) && el.id === questionA.sectionId,
      ) as ISection | undefined;
      if (!parentASection) return formElementsList;
      return swapFormElements(questionB, parentASection, formElementsList);
    }
  }

  // Fallback both at top level, swap their global positions
  return formElementsList.map((el) => {
    if (el.id === elementA.id && el.formElementType === elementA.formElementType) {
      return { ...el, position: elementB.position };
    }
    if (el.id === elementB.id && el.formElementType === elementB.formElementType) {
      return { ...el, position: elementA.position };
    }
    return el;
  });
};

export const swapAndSortFormElements = (
  elementA: IFormElement,
  elementB: IFormElement,
  formElementsList: IFormElement[],
): IFormElement[] => {
  const swappedList = swapFormElements(elementA, elementB, formElementsList);
  return swappedList.sort(compareFormElements);
};

export const moveQuestionToSection = (
  question: IQuestion,
  section: ISection,
  formElementsList: IFormElement[],
  direction: Direction,
): IFormElement[] => {
  if (!question.position) return formElementsList;
  const sectionPosition = direction === Direction.DOWN ? 1 : section.questions.length + 1;

  const newQuestion: IQuestion = {
    ...question,
    position: null,
    sectionId: section.id,
    sectionPosition: sectionPosition,
  };

  const updatedSection = {
    ...section,
    questions: [...fixListPositions(section.questions, sectionPosition, PositionActionType.CREATION), newQuestion].sort(
      compareFormElements,
    ),
  };
  //removeQuestion from top level, then update its new parent section, finally fix the position because of the deletion
  const updatedFormElementsList = fixListPositions(
    updateElementInList(removeFormElementFromList(formElementsList, question), updatedSection),
    question.position,
    PositionActionType.DELETION,
  );
  return updatedFormElementsList.sort(compareFormElements);
};

export const moveQuestionOutSection = (
  subQuestion: IQuestion,
  section: ISection,
  formElementsList: IFormElement[],
  direction: Direction,
): IFormElement[] => {
  if (!subQuestion.sectionId || !subQuestion.sectionPosition || !section.position) return formElementsList;
  const position = direction === Direction.UP ? section.position : section.position + 1;

  const newQuestion: IQuestion = {
    ...subQuestion,
    position: position,
    sectionId: null,
    sectionPosition: null,
  };

  const updatedSection = {
    ...section,
    questions: fixListPositions(
      removeFormElementFromList(section.questions, subQuestion),
      subQuestion.sectionPosition,
      PositionActionType.DELETION,
    ) as IQuestion[],
  };

  const updatedFormElementsList = [
    ...fixListPositions(updateElementInList(formElementsList, updatedSection), position, PositionActionType.CREATION),
    newQuestion,
  ];

  return updatedFormElementsList.sort(compareFormElements);
};

export const isTopElement = (element: IFormElement) => {
  return !!element.position;
};
export const isSubElement = (element: IFormElement) => {
  return isFormElementQuestion(element) && !!(element as IQuestion).sectionPosition;
};

export const handleTopMoveDown = (element: IFormElement, formElementList: IFormElement[]): IFormElement[] => {
  const followingElement = getFollowingFormElement(element, formElementList);
  if (!followingElement) return formElementList;

  // Case A: two top-level elements just swap
  if (isFormElementSection(element) || isFormElementQuestion(followingElement)) {
    return swapAndSortFormElements(element, followingElement, formElementList);
  }

  // Case B: a question is dropping down into a section
  if (isFormElementQuestion(element) && isFormElementSection(followingElement)) {
    return moveQuestionToSection(element as IQuestion, followingElement as ISection, formElementList, Direction.DOWN);
  }

  return formElementList;
};

export const handleTopMoveUp = (element: IFormElement, formElementList: IFormElement[]): IFormElement[] => {
  const previousElement = getPreviousFormElement(element, formElementList);
  if (!previousElement) return formElementList;

  // Case A: two top-level elements just swap
  if (isFormElementQuestion(previousElement) || isFormElementSection(element)) {
    return swapAndSortFormElements(previousElement, element, formElementList);
  }

  // Case B: a question is dropping up into a section
  if (isFormElementQuestion(element) && isFormElementSection(previousElement) && element.position) {
    return moveQuestionToSection(element as IQuestion, previousElement as ISection, formElementList, Direction.UP);
  }

  return formElementList;
};

export const handleSubMoveDown = (subQuestion: IQuestion, formElementList: IFormElement[]): IFormElement[] => {
  const parentSection = formElementList.find((el) => isFormElementSection(el) && el.id === subQuestion.sectionId) as
    | ISection
    | undefined;
  if (!parentSection || !parentSection.position) return formElementList;
  // Case A: subQuestion is the last question in the section, question get out of section
  if (subQuestion.sectionPosition === parentSection.questions.length) {
    return moveQuestionOutSection(subQuestion, parentSection, formElementList, Direction.DOWN);
  }

  // Case B: subQuestion is not the last question in the section, just swap with next question and update section
  const followingElement = getFollowingFormElement(subQuestion, formElementList) as IQuestion | undefined;
  if (!followingElement) return formElementList;
  const updatedParentSection = {
    ...parentSection,
    questions: swapAndSortFormElements(subQuestion, followingElement, parentSection.questions),
  };
  return updateElementInList(formElementList, updatedParentSection);
};

export const handleSubMoveUp = (subQuestion: IQuestion, formElementList: IFormElement[]): IFormElement[] => {
  const parentSection = formElementList.find((el) => isFormElementSection(el) && el.id === subQuestion.sectionId) as
    | ISection
    | undefined;
  if (!parentSection || !parentSection.position) return formElementList;

  // Case A: subQuestion is the first question in the section, question get out of section
  if (subQuestion.sectionPosition === 1) {
    return moveQuestionOutSection(subQuestion, parentSection, formElementList, Direction.UP);
  }

  // Case B: subQuestion is not the first question in the section, just swap with previous question  and update section
  const previousElement = getPreviousFormElement(subQuestion, formElementList) as IQuestion | undefined;
  if (!previousElement) return formElementList;

  const updatedParentSection = {
    ...parentSection,
    questions: swapAndSortFormElements(subQuestion, previousElement, parentSection.questions),
  };

  return updateElementInList(formElementList, updatedParentSection);
};

export const getTransformStyle = (
  transform: { x: number; y: number; scaleX: number; scaleY: number } | null,
  transition: string | undefined,
) => {
  const base = transition ?? "";

  // append your margin-left animation
  const merged = [base, "margin-left 200ms ease"]
    .filter(Boolean) // filter out any falsy values
    .join(", ");

  return {
    transform:
      transform && typeof transform.x === "number" && typeof transform.y === "number"
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
    transition: merged,
  };
};
