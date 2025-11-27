import { DragOverEvent } from "@dnd-kit/core";
import { DraggableType } from "~/core/enums";
import { IFolder } from "~/core/models/folder/types";
import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";
import { isFormElementQuestionRoot, isFormElementQuestionSection } from "~/core/models/question/utils";
import { isFormElementSection } from "~/core/models/section/utils";
import { ActiveElementType, DndMove, OverElementType } from "./enum";
import { IDragItemProps } from "./types";

export const TOP_OF_SECTION_ID = "top_of_section_id_";
export const BOTTOM_OF_SECTION_ID = "bottom_of_section_id_";

export const createItemState = (type: DraggableType, folder?: IFolder, form?: IForm): IDragItemProps => {
  return { type, folder, form };
};

export const isDraggedItemFolder = (activeDragItem: IDragItemProps): boolean => {
  return activeDragItem.type === DraggableType.FOLDER;
};

export const isDraggedItemForm = (activeDragItem: IDragItemProps): boolean => {
  return activeDragItem.type === DraggableType.FORM;
};

const isOverTopOfSection = ( over : DragOverEvent["over"], formElementsList: IFormElement[]): boolean => {
  if (typeof over?.id !== "string") return false;
  const overId = over.id;
  if (!overId.startsWith(TOP_OF_SECTION_ID)) return false;
  const sectionId = Number(overId.slice(TOP_OF_SECTION_ID.length));
  if (isNaN(sectionId)) return false;
  return formElementsList.some((element) => element.id === sectionId);
}

const isOverBottomOfSection = ( over : DragOverEvent["over"], formElementsList: IFormElement[]): boolean => {
  if (typeof over?.id !== "string") return false;
  const overId = over.id;
  if (!overId.startsWith(BOTTOM_OF_SECTION_ID)) return false;
  const sectionId = Number(overId.slice(BOTTOM_OF_SECTION_ID.length));
  if (isNaN(sectionId)) return false;
  return formElementsList.some((element) => element.id === sectionId);
}

const isOverSection = ( over : DragOverEvent["over"], formElementsList: IFormElement[]): boolean => {
  if (typeof over?.id !== "number") return false;
  const overId = over.id;
  const formElementOver: IFormElement | undefined = formElementsList.find((element) => element.id === overId);
  if (!formElementOver) return false;
  return isFormElementSection(formElementOver);
};

const isOverQuestionRoot = ( over : DragOverEvent["over"], formElementsList: IFormElement[]): boolean => {
  if (typeof over?.id !== "number") return false;
  const overId = over.id;
  const formElementOver: IFormElement | undefined = formElementsList.find((element) => element.id === overId);
  if (!formElementOver) return false;
  return isFormElementQuestionRoot(formElementOver);
};

const isOverQuestionSection = ( over : DragOverEvent["over"], formElementsList: IFormElement[]): boolean => {
  if (typeof over?.id !== "number") return false;
  const overId = over.id;
  const formElementOver: IFormElement | undefined = formElementsList.find((element) => element.id === overId);
  if (!formElementOver) return false;
  return isFormElementQuestionSection(formElementOver);
};

const getOverElementType = (over: DragOverEvent["over"], formElementsList: IFormElement[]): OverElementType | null => {
  if (isOverSection(over, formElementsList)) return OverElementType.SECTION;
  if (isOverTopOfSection(over, formElementsList)) return OverElementType.SECTION_TOP;
  if (isOverBottomOfSection(over, formElementsList)) return OverElementType.SECTION_BOTTOM;
  if (isOverQuestionRoot(over, formElementsList)) return OverElementType.QUESTION_ROOT;
  if (isOverQuestionSection(over, formElementsList)) return OverElementType.QUESTION_SECTION;
  return null;
};


const getActiveElementType = (active: IFormElement | null): ActiveElementType | null => {
  if (!active) return null;
  if (isFormElementSection(active)) return ActiveElementType.SECTION;
  if (isFormElementQuestionRoot(active)) return ActiveElementType.QUESTION_ROOT;
  if (isFormElementQuestionSection(active)) return ActiveElementType.QUESTION_SECTION;
  return null;
};


// S = SECTION
// ST = SECTION_TOP
// SB = SECTION_BOTTOM
// QR = QUESTION_ROOT
// QS = QUESTION_SECTION
export const getDndMove = (
  active: IFormElement | null,
  over: DragOverEvent["over"],
  formElementsList: IFormElement[]
): DndMove | null => {
  const overElementType: OverElementType | null = getOverElementType(over, formElementsList);
  const activeElementType: ActiveElementType | null = getActiveElementType(active);

  if (!overElementType || !activeElementType) return null;

  //
  // 1️⃣ SWITCH_ROOT_ELEMENTS
  //
  // S → S
  if (activeElementType === ActiveElementType.SECTION && overElementType === OverElementType.SECTION)
    return DndMove.SWITCH_ROOT_ELEMENTS;

  // S → QR
  if (activeElementType === ActiveElementType.SECTION && overElementType === OverElementType.QUESTION_ROOT)
    return DndMove.SWITCH_ROOT_ELEMENTS;

  // QR → QR
  if (activeElementType === ActiveElementType.QUESTION_ROOT && overElementType === OverElementType.QUESTION_ROOT)
    return DndMove.SWITCH_ROOT_ELEMENTS;


  //
  // 2️⃣ SWITCH_QUESTIONS_SECTION
  //
  // QS → QS (déplacement interne à la section)
  if (activeElementType === ActiveElementType.QUESTION_SECTION && overElementType === OverElementType.QUESTION_SECTION)
    return DndMove.SWITCH_QUESTIONS_SECTION;

  // QS → ST (déposer en haut de la section)
  if (activeElementType === ActiveElementType.QUESTION_SECTION && overElementType === OverElementType.SECTION_TOP)
    return DndMove.SWITCH_QUESTIONS_SECTION;

  // QS → SB (déposer en bas de la section)
  if (activeElementType === ActiveElementType.QUESTION_SECTION && overElementType === OverElementType.SECTION_BOTTOM)
    return DndMove.SWITCH_QUESTIONS_SECTION;


  //
  // 3️⃣ SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT
  //
  // QR → QS (une question root entre dans une section)
  if (activeElementType === ActiveElementType.QUESTION_ROOT && overElementType === OverElementType.QUESTION_SECTION)
    return DndMove.SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT;

  // QR → ST
  if (activeElementType === ActiveElementType.QUESTION_ROOT && overElementType === OverElementType.SECTION_TOP)
    return DndMove.SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT;

  // QR → SB
  if (activeElementType === ActiveElementType.QUESTION_ROOT && overElementType === OverElementType.SECTION_BOTTOM)
    return DndMove.SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT;

  // QS → QR (question sort d'une section)
  if (activeElementType === ActiveElementType.QUESTION_SECTION && overElementType === OverElementType.QUESTION_ROOT)
    return DndMove.SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT;

  // QS → ST
  if (activeElementType === ActiveElementType.QUESTION_SECTION && overElementType === OverElementType.SECTION_TOP)
    return DndMove.SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT;

  // QS → SB
  if (activeElementType === ActiveElementType.QUESTION_SECTION && overElementType === OverElementType.SECTION_BOTTOM)
    return DndMove.SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT;

  return null;
};

export const moveRootElements = (elements: IFormElement[], active: IFormElement, over: IFormElement): IFormElement[] => {
  const activePos = active.position;
  const overPos = over.position;
  if (!activePos || !overPos) return elements;

  // check peut etre useless
  const sortedElements = elements.sort((a, b) => (a.position || 0) - (b.position || 0));

  if (activePos < overPos) {
    const elementsBeforeActive = sortedElements.filter(e => e.position && e.position < activePos);
    const elementsBetweenActiveAndOver = sortedElements.filter(e => e.position && e.position > activePos && e.position <= overPos);
    const elementsBetweenActiveAndOverWithNewPos = elementsBetweenActiveAndOver.map(e => ({...e, position: (e.position ?? 0) - 1}));
    const elementsAfterOver = sortedElements.filter(e => e.position && e.position > overPos);

    return [
      ...elementsBeforeActive,
      ...elementsBetweenActiveAndOverWithNewPos,
      {...active, position: overPos},
      ...elementsAfterOver
    ];
  }
  if (activePos > overPos) {
  const elementsBeforeOver = sortedElements.filter(e => e.position && e.position < overPos);
  const elementsBetweenOverAndActive = sortedElements.filter(e => e.position && e.position >= overPos && e.position < activePos);
  const elementsBetweenOverAndActiveWithNewPos = elementsBetweenOverAndActive.map(e => ({ ...e, position: (e.position ?? 0) + 1 }));
  const elementsAfterActive = sortedElements.filter(e => e.position && e.position > activePos);

    return [
      ...elementsBeforeOver,
      { ...active, position: overPos },
      ...elementsBetweenOverAndActiveWithNewPos,
      ...elementsAfterActive
    ];
  }
  return sortedElements;
}