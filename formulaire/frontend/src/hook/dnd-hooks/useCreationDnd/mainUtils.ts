import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { ISection } from "~/core/models/section/types";
import { isFormElementSection } from "~/core/models/section/utils";
import { ActiveElementType, DndElementType, DndMove } from "./enum";
import { addQuestionToSection, removeQuestionFromSection } from "./utils";


// S = SECTION
// ST = SECTION_TOP
// SB = SECTION_BOTTOM
// QR = QUESTION_ROOT
// QS = QUESTION_SECTION
export const getDndMove = (
  activeElementType: ActiveElementType,
  overElementType: DndElementType
): DndMove | null => {
  //
  // 1️⃣ SWITCH_ROOT_ELEMENTS
  //
  // S → S
  if (activeElementType === ActiveElementType.SECTION && overElementType === DndElementType.SECTION)
    return DndMove.SWITCH_ROOT_ELEMENTS;

  // S → QR
  if (activeElementType === ActiveElementType.SECTION && overElementType === DndElementType.QUESTION_ROOT)
    return DndMove.SWITCH_ROOT_ELEMENTS;

  // QR → QR
  if (activeElementType === ActiveElementType.QUESTION_ROOT && overElementType === DndElementType.QUESTION_ROOT)
    return DndMove.SWITCH_ROOT_ELEMENTS;


  //
  // 2️⃣ SWITCH_QUESTIONS_SECTION
  //
  // QS → QS (déplacement interne à la section)
  if (activeElementType === ActiveElementType.QUESTION_SECTION && overElementType === DndElementType.QUESTION_SECTION)
    return DndMove.SWITCH_QUESTIONS_SECTION;

  // QS → ST (déposer en haut de la section)
  if (activeElementType === ActiveElementType.QUESTION_SECTION && overElementType === DndElementType.SECTION_TOP)
    return DndMove.SWITCH_QUESTIONS_SECTION;

  // QS → SB (déposer en bas de la section)
  if (activeElementType === ActiveElementType.QUESTION_SECTION && overElementType === DndElementType.SECTION_BOTTOM)
    return DndMove.SWITCH_QUESTIONS_SECTION;


  //
  // 3️⃣ SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT
  //
  // QR → QS (une question root entre dans une section)
  if (activeElementType === ActiveElementType.QUESTION_ROOT && overElementType === DndElementType.QUESTION_SECTION)
    return DndMove.SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT;

  // QR → ST
  if (activeElementType === ActiveElementType.QUESTION_ROOT && overElementType === DndElementType.SECTION_TOP)
    return DndMove.SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT;

  // QR → SB
  if (activeElementType === ActiveElementType.QUESTION_ROOT && overElementType === DndElementType.SECTION_BOTTOM)
    return DndMove.SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT;

  // QS → QR (question sort d'une section)
  if (activeElementType === ActiveElementType.QUESTION_SECTION && overElementType === DndElementType.QUESTION_ROOT)
    return DndMove.SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT;

  // QS → ST
  if (activeElementType === ActiveElementType.QUESTION_SECTION && overElementType === DndElementType.SECTION_TOP)
    return DndMove.SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT;

  // QS → SB
  if (activeElementType === ActiveElementType.QUESTION_SECTION && overElementType === DndElementType.SECTION_BOTTOM)
    return DndMove.SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT;

  return null;
};

export const moveRootElements = (elements: IFormElement[], active: IFormElement, over: IFormElement): IFormElement[] => {
  const activePos = active.position;
  const overPos = over.position;
  if (!activePos || !overPos) return elements;

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


export const moveQuestionsInSameSection = (questions: IQuestion[], active: IQuestion, over: IQuestion): IQuestion[] => {
  const activeSectionPos = active.sectionPosition;
  const overSectionPos = over.sectionPosition;
  if(!activeSectionPos || !overSectionPos) return questions;

  const sortedQuestions = [...questions].sort((a, b) => (a.sectionPosition || 0) - (b.sectionPosition || 0));

  if (activeSectionPos < overSectionPos) {
    const questionsBeforeActive =  sortedQuestions.filter(q => q.sectionPosition && q.sectionPosition < activeSectionPos);
    const questionsBetweenActiveAndOver = sortedQuestions.filter(q => q.sectionPosition && q.sectionPosition > activeSectionPos && q.sectionPosition <= overSectionPos);
    const questionsBetweenActiveAndOverWithNewPos = questionsBetweenActiveAndOver.map(q => ({...q, sectionPosition: (q.sectionPosition ?? 0) - 1}));
    const  questionsAfterOver = sortedQuestions.filter(q => q.sectionPosition && q.sectionPosition > overSectionPos);

    return [
      ...questionsBeforeActive,
      ...questionsBetweenActiveAndOverWithNewPos,
      {...active, sectionPosition: overSectionPos},
      ...questionsAfterOver
    ]
  }

  if (activeSectionPos > overSectionPos) {
    const questionsBeforeOver = sortedQuestions.filter(q => q.sectionPosition && q.sectionPosition < overSectionPos);
    const questionsBetweenOverAndActive = sortedQuestions.filter(q => q.sectionPosition && q.sectionPosition >= overSectionPos && q.sectionPosition < activeSectionPos);
    const questionsBetweenOverAndActiveWithNewPos = questionsBetweenOverAndActive.map(q => ({ ...q, sectionPosition: (q.sectionPosition ?? 0) + 1 }));
    const questionsAfterActive = sortedQuestions.filter(q => q.sectionPosition && q.sectionPosition > activeSectionPos);

    return [
      ...questionsBeforeOver,
      ...questionsBetweenOverAndActiveWithNewPos,
      {...active, sectionPosition: overSectionPos},
      ...questionsAfterActive
    ];
  }

  return sortedQuestions;
}



export const moveQuestionSectionToOtherSection = (elements: IFormElement[], activeQuestion: IQuestion, overQuestion: IQuestion) => {
  const activeSection = elements.find(e => isFormElementSection(e) && (e as ISection).questions.some(q => q.id === activeQuestion.id)) as ISection;
  const overSection = elements.find(e => isFormElementSection(e) && (e as ISection).questions.some(q => q.id === overQuestion.id)) as ISection;
  if (!activeSection || !overSection) return elements;
  const activeSectionPos = activeSection.position;
  const overSectionPos = overSection.position;
  if (!activeSectionPos || !overSectionPos) return elements;

  const moveActiveQuestionAfterOverQuestion = activeSectionPos < overSectionPos;

  const newActiveSection = removeQuestionFromSection(activeSection, activeQuestion);
  const newOverSection = addQuestionToSection(overSection, activeQuestion, overQuestion, moveActiveQuestionAfterOverQuestion);

  return elements.map(e => {
    if (e.id === newActiveSection.id) return newActiveSection;
    if (e.id === newOverSection.id) return newOverSection;
    return e;
  });
}

export const moveQuestionRootIntoSection = (elements: IFormElement[], activeQuestion: IQuestion, overSection: ISection, after?: boolean) => {



