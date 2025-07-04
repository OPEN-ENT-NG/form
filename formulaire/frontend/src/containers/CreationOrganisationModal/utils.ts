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
export function flattenFormElements(
  formElements: IFormElement[],
  parentId: number | null = null,
  depth: number = 0,
): IFlattenedItem[] {
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
      const children = flattenFormElements(section.questions, section.id, depth + 1);
      return [...acc, flattened, ...children];
    }

    // Plain question (either top-level or already carries sectionId in its data)
    return [...acc, flattened];
  }, []);
}

/**
 * Rebuild the nested tree of sections and questions from a DnD-sorted flat list.
 * Root-level items are those with parentId === null. Sections will collect all children
 * whose parentId matches their ID.
 */
export function buildTree(flatItems: IFlattenedItem[]): IFormElement[] {
  const result: IFormElement[] = [];

  // 1) Walk the flat list in order, but only look at roots (parentId === null)
  flatItems
    .filter((item) => item.parentId === null)
    .forEach((item, rootIndex) => {
      // clone so we don’t mutate the original element
      const el = { ...item.element };

      if (isFormElementSection(el)) {
        // This is a section: assign its top-level position, then rebuild questions
        const section = el as ISection;
        section.position = rootIndex;

        // find all direct children (in their flat-list order)
        const childItems = flatItems.filter((ci) => ci.parentId === section.id);

        section.questions = childItems.map((ci, qIndex) => {
          const q = { ...(ci.element as IQuestion) };
          q.sectionId = section.id;
          q.sectionPosition = qIndex;
          q.position = null; // clear its top-level position
          return q;
        });

        result.push(section);
      } else {
        // plain top-level question
        const q = el as IQuestion;
        q.position = rootIndex; // ensure its position matches its index
        q.sectionId = null; // safety
        q.sectionPosition = null;
        result.push(q);
      }
    });

  return result;
}

// ----------------------------------------------
// Projection logic: computes new depth & parent on the fly

/** Round horizontal offset to an integer "depth" change based on indentation width */
function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

/** Max legal depth based on previous item */
function getMaxDepth(previousItem?: IFlattenedItem) {
  const previousElement = previousItem?.element;
  if (!previousElement) return 0;
  if (isFormElementSection(previousElement)) {
    return previousItem.depth + 1;
  }

  return previousItem.depth;
}

/** Min legal depth based on next item */
function getMinDepth(nextItem?: IFlattenedItem) {
  return nextItem ? nextItem.depth : 0;
}

/**
 * Compute where an item would land if dropped right now.
 * @param items The flattened list of items (pre-move)
 * @param activeId The id of the item being dragged
 * @param overId The id of the item being hovered over
 * @param dragOffset The delta.x from drag
 * @param indentationWidth The width in px for one depth level
 */
export function getProjection(
  items: IFlattenedItem[],
  activeId: number,
  overId: number,
  dragOffset: number,
  indentationWidth: number,
) {
  const oldIndex = items.findIndex(({ id }) => id === activeId);
  const newIndex = items.findIndex(({ id }) => id === overId);
  const activeItem = items[oldIndex];

  // Simulate reordering
  const reord = arrayMove(items, oldIndex, newIndex);
  console.log("Reordered items:", reord);

  const previousItem = reord[newIndex - 1];
  const nextItem = reord[newIndex + 1];

  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;

  const maxDepth = getMaxDepth(previousItem);
  const minDepth = getMinDepth(nextItem);

  let depth = projectedDepth;
  if (depth > maxDepth) depth = maxDepth;
  if (depth < minDepth) depth = minDepth;

  // Determine new parentId
  let parentId: number | null;
  if (depth === 0 || !previousItem.depth) {
    parentId = null;
  } else if (depth === previousItem.depth) {
    parentId = previousItem.parentId;
  } else if (depth > previousItem.depth) {
    parentId = previousItem.id;
  } else {
    // depth < previousItem.depth
    const prevAtDepth = reord
      .slice(0, newIndex)
      .reverse()
      .find((item) => item.depth === depth);
    parentId = prevAtDepth ? prevAtDepth.parentId : null;
  }

  console.log("Projection result:", { depth, maxDepth, minDepth, parentId });
  return { depth, maxDepth, minDepth, parentId };
}
