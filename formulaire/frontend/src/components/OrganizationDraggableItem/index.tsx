import { FC } from "react";
import { Typography, Box } from "@cgi-learning-hub/ui";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { isFormElementSection } from "~/core/models/section/utils";
import { IFormElementRowProps } from "./types";
import { dragIconStyle, StyledPaper } from "./style";
import { TypographyVariant } from "~/core/style/themeProps";
import { useCreation } from "~/providers/CreationProvider";
import { getUpDownButtons } from "./utils";
import { IFormElement } from "~/core/models/formElement/types";
import { isFormElementQuestion } from "~/core/models/question/utils";
import { IQuestion } from "~/core/models/question/types";
import {
  fixListPositions,
  getFollowingFormElement,
  getPreviousFormElement,
  removeFormElementFromList,
  updateElementInList,
} from "~/providers/CreationProvider/utils";
import { Direction } from "./enum";
import { ISection } from "~/core/models/section/types";
import { PositionActionType } from "~/providers/CreationProvider/enum";

export const OrganizationDraggableItem: FC<IFormElementRowProps> = ({ element, indent = 0 }) => {
  const { formElementsList, setFormElementsList } = useCreation();
  const isSection = isFormElementSection(element);

  const swapElementsPositions = (elementA: IFormElement, elementB: IFormElement, formElementList: IFormElement[]) => {
    const updatedList = formElementList.map((el) => {
      if (el.id === elementA.id && el.formElementType === elementA.formElementType) {
        return { ...el, position: elementB.position };
      }
      if (el.id === elementB.id && el.formElementType === elementB.formElementType) {
        return { ...el, position: elementA.position };
      }
      return el;
    });
    return updatedList;
  };

  const swapElementsSectionPositions = (
    elementA: IQuestion,
    elementB: IQuestion,
    questionsList: IQuestion[],
  ): IFormElement[] => {
    const updatedList = questionsList.map((el) => {
      if (el.id === elementA.id) {
        return { ...el, sectionPosition: elementB.sectionPosition, sectionId: elementB.id };
      }
      if (el.id === elementB.id) {
        return { ...el, sectionPosition: elementA.sectionPosition, sectionId: elementA.id };
      }
      return el;
    });
    return updatedList;
  };

  const handleReorderClick = (element: IFormElement, formElementList: IFormElement[], direction: Direction) => {
    const isTopElement = !!element.position;
    const isSubElement = isFormElementQuestion(element) && !!(element as IQuestion).sectionPosition;

    if (isTopElement) {
      if (direction === Direction.DOWN) {
        const followingElement = getFollowingFormElement(element, formElementList);
        if (!followingElement) return;
        if (isFormElementSection(element) || isFormElementQuestion(followingElement)) {
          setFormElementsList(
            swapElementsPositions(element, followingElement, formElementList).sort((a, b) => sortFn(a, b)),
          );
          return;
        }
        if (isFormElementQuestion(element) && isFormElementSection(followingElement)) {
          const updatedQuestion = {
            ...element,
            position: null,
            sectionPosition: 1,
            sectionId: followingElement.id,
          } as IQuestion;
          const parentSection = followingElement as ISection;
          const updatedParentSection = {
            ...parentSection,
            questions: [
              ...(fixListPositions(parentSection.questions, 1, PositionActionType.CREATION) as IQuestion[]),
              updatedQuestion,
            ].sort(sortSubFn),
          };
          const updatedList = fixListPositions(
            removeFormElementFromList(updateElementInList(formElementList, updatedParentSection), element),
            2,
            PositionActionType.DELETION,
          );

          setFormElementsList(updatedList);
          return;
        }
      }
      const previousElement = getPreviousFormElement(element, formElementList);
      if (!previousElement) return;
      if (isFormElementQuestion(previousElement) || isFormElementSection(element)) {
        setFormElementsList(
          swapElementsPositions(previousElement, element, formElementList).sort((a, b) => sortFn(a, b)),
        );
        return;
      }

      if (isFormElementQuestion(element) && isFormElementSection(previousElement) && element.position) {
        const previousSection = previousElement as ISection;
        const updatedQuestion = {
          ...element,
          position: null,
          sectionPosition: previousSection.questions.length + 1,
          sectionId: previousElement.id,
        } as IQuestion;
        const updatedParentSection = {
          ...previousSection,
          questions: [...previousSection.questions, updatedQuestion],
        };

        const updatedList = fixListPositions(
          removeFormElementFromList(updateElementInList(formElementList, updatedParentSection), element),
          element.position,
          PositionActionType.DELETION,
        );

        setFormElementsList(updatedList);
        return;
      }
    }

    if (isSubElement) {
      const subQuestion = element as IQuestion;
      const parentSection = formElementList.find(
        (el) => isFormElementSection(el) && el.id === subQuestion.sectionId,
      ) as ISection | undefined;
      if (!parentSection || !parentSection.position) return;

      if (direction === Direction.UP) {
        if (subQuestion.sectionPosition === 1) {
          const updatedQuestion = {
            ...subQuestion,
            position: parentSection.position,
            sectionPosition: null,
            sectionId: null,
          };

          const updatedParentSection = {
            ...parentSection,
            questions: fixListPositions(
              removeFormElementFromList(parentSection.questions, subQuestion),
              subQuestion.sectionPosition,
              PositionActionType.DELETION,
            ) as IQuestion[],
          };

          const updatedList = [
            ...fixListPositions(
              updateElementInList(formElementList, updatedParentSection),
              updatedQuestion.position,
              PositionActionType.CREATION,
            ),
            updatedQuestion,
          ].sort((a, b) => sortFn(a, b));

          setFormElementsList(updatedList);
          return;
        }

        const previousElement = getPreviousFormElement(subQuestion, formElementList) as IQuestion | undefined;
        console.log("followingElement", subQuestion, parentSection, previousElement);
        console.log(direction, isTopElement, isSubElement);
        if (!previousElement) return;
        const updatedParentSection = {
          ...parentSection,
          questions: (
            swapElementsSectionPositions(subQuestion, previousElement, parentSection.questions) as IQuestion[]
          ).sort(sortSubFn),
        };

        console.log("updatedParentSection", updatedParentSection);
        setFormElementsList(updateElementInList(formElementList, updatedParentSection));
        return;
      }

      if (subQuestion.sectionPosition === parentSection.questions.length) {
        const updatedQuestion = {
          ...subQuestion,
          position: parentSection.position + 1,
          sectionPosition: null,
          sectionId: null,
        };

        const updatedParentSection = {
          ...parentSection,
          questions: fixListPositions(
            removeFormElementFromList(parentSection.questions, subQuestion),
            subQuestion.sectionPosition,
            PositionActionType.DELETION,
          ) as IQuestion[],
        };

        const updatedList = [
          ...fixListPositions(
            updateElementInList(formElementList, updatedParentSection),
            updatedQuestion.position,
            PositionActionType.CREATION,
          ),
          updatedQuestion,
        ].sort((a, b) => sortFn(a, b));

        setFormElementsList(updatedList);
        return;
      }

      const followingElement = getFollowingFormElement(subQuestion, parentSection.questions) as IQuestion | undefined;
      if (!followingElement) return;
      const updatedParentSection = {
        ...parentSection,
        questions: (
          swapElementsSectionPositions(subQuestion, followingElement, parentSection.questions) as IQuestion[]
        ).sort(sortSubFn),
      };
      setFormElementsList(updateElementInList(formElementList, updatedParentSection));
      return;
    }
  };

  const sortFn = (a: IFormElement, b: IFormElement) => {
    if (!a.position && !b.position) return 0;
    if (!a.position) return 1;
    if (!b.position) return -1;
    return a.position - b.position;
  };

  const sortSubFn = (a: IQuestion, b: IQuestion) => {
    if (!a.sectionPosition && !b.sectionPosition) return 0;
    if (!a.sectionPosition) return 1;
    if (!b.sectionPosition) return -1;
    return a.sectionPosition - b.sectionPosition;
  };

  return (
    <Box sx={{ marginLeft: indent }}>
      <StyledPaper elevation={2} isSection={isSection}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <DragIndicatorRoundedIcon sx={dragIconStyle} />
          </Box>
          <Box>
            <Typography variant={TypographyVariant.BODY2}>{element.title}</Typography>
          </Box>
        </Box>
        <Box>{getUpDownButtons(element, formElementsList, handleReorderClick)}</Box>
      </StyledPaper>
    </Box>
  );
};
