import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { IFlattenedItem } from "./types";
import { arrayMove } from "@dnd-kit/sortable";
import { isSection } from "~/core/models/formElement/utils";

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

    if (isSection(el)) {
      // Section itself at current depth
      // Then flatten its questions at depth + 1
      const children = formElementsListToFlattenedItemList(el.questions, el.id, depth + 1);
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
        if (isSection(item.element)) {
          const section = item.element;
          section.position = index + 1; //position starts at 1

          // collect all children of this section
          section.questions = flatItems
            .filter((childrenQuestion) => childrenQuestion.parentId === section.id)
            .map((childrenQuestion, questionIndex) => ({
              ...(childrenQuestion.element as IQuestion),
              sectionId: section.id,
              sectionPosition: questionIndex + 1,
              position: null,
            }));

          // append the section to the tree
          return [...acc, section];
        }
        // top-level question
        const question = item.element as IQuestion;
        question.position = index + 1;
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
  if (isSection(activeItem.element)) {
    return 0;
  }
  const previousElement = previousItem.element;
  if (isSection(previousElement)) {
    return previousItem.depth + 1;
  }

  return previousItem.depth;
};

/** Min legal depth based on next item */
const getMinDepth = (activeItem: IFlattenedItem, nextItem: IFlattenedItem | null) => {
  if (!nextItem) return 0;

  if (isSection(activeItem.element)) {
    return 0;
  }

  return nextItem.depth;
};

/**
 * Compute where an item would land if dropped right now.
 * @param {IFlattenedItem[]} flattenedItems - The flattened list of items (pre-move)
 * @param {number} activeId - The id of the item being dragged
 * @param {number} overId - The id of the item being hovered over
 * @param {number} dragXOffset - The delta.x from drag
 * @param {number} indentationWidth - The width in px for one depth level
 * @returns {{depth: number, parentId: number|null, oldIndex: number, newIndex: number}}
 */
export const getProjection = (
  flattenedItems: IFlattenedItem[],
  activeId: number,
  overId: number,
  dragXOffset: number,
  indentationWidth: number,
) => {
  // Compute basic movement and depth projection
  const basic = computeBasicProjection(flattenedItems, activeId, overId, dragXOffset, indentationWidth);

  // Constrain depth within allowable bounds
  const depth = applyDepthConstraints(basic);

  // Determine the correct parent based on constrained depth
  const parentId = determineParentId({ ...basic, depth });

  return {
    depth,
    parentId,
    oldIndex: basic.oldIndex,
    newIndex: basic.newIndex,
  };
};

/**
 * Extracts indices, items and projected depth before constraints.
 */
export function computeBasicProjection(
  flattenedItems: IFlattenedItem[],
  activeId: number,
  overId: number,
  dragXOffset: number,
  indentationWidth: number,
) {
  const oldIndex = flattenedItems.findIndex(({ id }) => id === activeId);
  const newIndex = flattenedItems.findIndex(({ id }) => id === overId);
  const activeItem = flattenedItems[oldIndex];

  // Simulate reordering
  const projectedReorderedList = oldIndex !== newIndex ? arrayMove(flattenedItems, oldIndex, newIndex) : flattenedItems;

  const previousItem = newIndex > 0 ? projectedReorderedList[newIndex - 1] : null;
  const nextItem = newIndex < projectedReorderedList.length - 1 ? projectedReorderedList[newIndex + 1] : null;

  const dragDepth = getDragDepth(dragXOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;

  return {
    oldIndex,
    newIndex,
    activeItem,
    previousItem,
    nextItem,
    projectedDepth,
  };
}

/**
 * Applies min/max depth constraints based on neighboring items.
 */
export function applyDepthConstraints({
  activeItem,
  previousItem,
  nextItem,
  projectedDepth,
}: {
  activeItem: IFlattenedItem;
  previousItem: IFlattenedItem | null;
  nextItem: IFlattenedItem | null;
  projectedDepth: number;
}) {
  const maxDepth = getMaxDepth(activeItem, previousItem);
  const minDepth = getMinDepth(activeItem, nextItem);
  return Math.min(Math.max(projectedDepth, minDepth), maxDepth);
}

/**
 * Determines the correct parentId based on constrained depth.
 */
export function determineParentId({
  depth,
  activeItem,
  previousItem,
}: {
  depth: number;
  activeItem: IFlattenedItem;
  previousItem: IFlattenedItem | null;
}) {
  // If no previous item or depth is root, parent is null
  if (!previousItem || depth === 0) return null;

  // Same level as previous => same parent
  if (depth === previousItem.depth) return previousItem.parentId;

  // Deeper than previous => previous becomes parent
  if (depth > previousItem.depth) return previousItem.id;

  // Shallower than previous => retain original parent
  return activeItem.parentId;
}
