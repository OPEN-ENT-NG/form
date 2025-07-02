import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { isFormElementQuestion } from "~/core/models/question/utils";
import { Box } from "@cgi-learning-hub/ui";
import { arrowIconStyle, StyledIconButton } from "./style";
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

export const swapFormElements = (
  elementA: IFormElement,
  elementB: IFormElement,
  formElementsList: IFormElement[],
): IFormElement[] => {
  const bothQuestions = isFormElementQuestion(elementA) && isFormElementQuestion(elementB);

  // If both are questions in the same section, swap only their sectionPosition
  if (bothQuestions) {
    const questionA = elementA as IQuestion;
    const questionB = elementB as IQuestion;

    // Only swap within a section when they share a sectionId
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
  }

  // Fallback: swap their global positions
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

export const compareFormElements = (elementA: IFormElement, elementB: IFormElement): number => {
  //If both are questions in the same section, sort by sectionPosition

  const bothQuestions = isFormElementQuestion(elementA) && isFormElementQuestion(elementB);
  if (bothQuestions) {
    const questionA = elementA as IQuestion;
    const questionB = elementB as IQuestion;

    if (questionA.sectionId && questionB.sectionId && questionA.sectionId === questionB.sectionId) {
      const posa = questionA.sectionPosition;
      const posb = questionB.sectionPosition;

      if (posa == null && posb == null) return 0;
      if (posa == null) return 1;
      if (posb == null) return -1;
      return posa - posb;
    }
  }

  //Otherwise fall back to their global position
  const positionA = elementA.position;
  const positionB = elementB.position;

  if (positionA == null && positionB == null) return 0;
  if (positionA == null) return 1;
  if (positionB == null) return -1;
  return positionA - positionB;
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
  if (!question.position) return [];
  const position = direction === Direction.DOWN ? 1 : section.questions.length + 1;

  const newQuestion: IQuestion = {
    ...question,
    position: null,
    sectionId: section.id,
    sectionPosition: position,
  };

  const updatedSection = {
    ...section,
    questions: [...fixListPositions(section.questions, position, PositionActionType.CREATION), newQuestion].sort(
      compareFormElements,
    ),
  };

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
  if (!subQuestion.sectionId || !subQuestion.sectionPosition || !section.position) return [];
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
  console.log("followingElement", followingElement, formElementList);
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
