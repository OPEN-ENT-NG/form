import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { ISection } from "~/core/models/section/types";
import { isFormElementSection } from "~/core/models/section/utils";
import { IFlattenedItem } from "./types";
import { arrayMove } from "@dnd-kit/sortable";

/**
 * Recursively flatten a mixed list of sections and top-level questions into a single array.
 * Sections (ISection) produce one FlattenedItem at depth 0, then each of their questions at depth 1.
 * Questions with sectionId === null (top-level) appear at depth 0.
 */
export const formElementsListToFlattenedItemList = (
  formElements: IFormElement[],
  parentId: number | null = null,
  depth: number = 0,
): IFlattenedItem[] => {
  return formElements.reduce<IFlattenedItem[]>((acc, el) => {
    if (el.id === null) {
      return acc;
    }

    const flattened: IFlattenedItem = {
      id: el.id,
      element: el,
      parentId,
      depth,
    };

    if (isFormElementSection(el)) {
      // Section itself at current depth
      const section = el as ISection;
      // Then flatten its questions at depth + 1
      const children = formElementsListToFlattenedItemList(section.questions, section.id, depth + 1);
      return [...acc, flattened, ...children];
    }

    // Plain question (either top-level or already carries sectionId in its data)
    return [...acc, flattened];
  }, []);
};


/**
 * Rebuild the nested tree of sections and questions from a DnD-sorted flat list.
 * Root-level items are those with parentId === null. Sections will collect all children
 * whose parentId matches their ID.
 */
export const buildTree = (flatItems: IFlattenedItem[]): IFormElement[] => {
  return (
    flatItems
      // 1) only root elements
      .filter((item) => item.parentId === null)
      // 2) build up your tree in a reduce
      .reduce<IFormElement[]>((acc, item, index) => {
        // clone so we don’t mutate original

        if (isFormElementSection(item.element)) {
          const section = item.element as ISection;
          section.position = index;

          // collect all children of this section
          section.questions = flatItems
            .filter((childrenQuestion) => childrenQuestion.parentId === section.id)
            .map((childrenQuestion, questionIndex) => ({
              ...(childrenQuestion.element as IQuestion),
              sectionId: section.id,
              sectionPosition: questionIndex,
              position: null,
            }));

          // append the section to the tree
          return [...acc, section];
        }
        // top-level question
        const question = item.element as IQuestion;
        question.position = index;
        question.sectionId = null;
        question.sectionPosition = null;

        return [...acc, question];
      }, [])
  );
};

// ----------------------------------------------
// Projection logic: computes new depth, parent and indexes on the fly

/** Round horizontal offset to an integer "depth" change based on indentation width */
const getDragDepth = (offset: number, indentationWidth: number) => {
  return Math.round(offset / indentationWidth);
};

/** Max legal depth based on previous item */
const getMaxDepth = (activeItem: IFlattenedItem, previousItem: IFlattenedItem | null) => {
  if (!previousItem) return 0;
  if (isFormElementSection(activeItem.element)) {
    return 0;
  }
  const previousElement = previousItem.element;
  if (isFormElementSection(previousElement)) {
    return previousItem.depth + 1;
  }

  return previousItem.depth;
};

/** Min legal depth based on next item */
const getMinDepth = (activeItem: IFlattenedItem, nextItem: IFlattenedItem | null) => {
  if (!nextItem) return 0;

  if (isFormElementSection(activeItem.element)) {
    return 0;
  }

  return nextItem.depth;
};

/**
 * Compute where an item would land if dropped right now.
 * @param flattenedItems The flattened list of items (pre-move)
 * @param activeId The id of the item being dragged
 * @param overId The id of the item being hovered over
 * @param dragOffset The delta.x from drag
 * @param indentationWidth The width in px for one depth level
 * @returns An object with the new depth, parentId, oldIndex and newIndex
 */
export const getProjection = (
  flattenedItems: IFlattenedItem[],
  activeId: number,
  overId: number,
  dragXOffset: number,
  indentationWidth: number,
) => {
  const oldIndex = flattenedItems.findIndex(({ id }) => id === activeId);
  const newIndex = flattenedItems.findIndex(({ id }) => id === overId);
  const activeItem = flattenedItems[oldIndex];

  // Simulate reordering
  const projectedReorderedList = oldIndex !== newIndex ? arrayMove(flattenedItems, oldIndex, newIndex) : flattenedItems;
  const previousItem = newIndex > 0 ? projectedReorderedList[newIndex - 1] : null;
  const nextItem = newIndex < projectedReorderedList.length ? projectedReorderedList[newIndex + 1] : null;

  const dragDepth = getDragDepth(dragXOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;

  const maxDepth = getMaxDepth(activeItem, previousItem);
  const minDepth = getMinDepth(activeItem, nextItem);
  const depth = Math.min(Math.max(projectedDepth, minDepth), maxDepth);

  // no previous or depth is root
  if (!previousItem || depth === 0) {
    return { depth, parentId: null, oldIndex, newIndex };
  }

  // same level as previous, same parent as previous
  if (depth === previousItem.depth) {
    return {
      depth,
      parentId: previousItem.parentId,
      oldIndex,
      newIndex,
    };
  }

  // 3) deeper, previous becomes parent
  if (depth > previousItem.depth) {
    return {
      depth,
      parentId: previousItem.id,
      oldIndex,
      newIndex,
    };
  }

  return {
    depth,
    parentId: activeItem.parentId,
    oldIndex,
    newIndex,
  };
};
