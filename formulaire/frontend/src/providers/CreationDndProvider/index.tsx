import { DragMoveEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { createContext, FC, useContext, useMemo, useState } from "react";
import { CURSOR_STYLE_GRABBING } from "~/core/constants";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { ISection } from "~/core/models/section/types";
import { isFormElementSection } from "~/core/models/section/utils";
import { useCreation } from "../CreationProvider";
import { CreationDndProviderContextType, ICreationDndProviderProps } from "./types";
import { findFormElementById, getType } from "./utils";

const CreationDndProviderContext = createContext<CreationDndProviderContextType | null>(null);

export const useCreationDnd = () => {
  const context = useContext(CreationDndProviderContext);
  if (!context) {
    throw new Error("useCreationDnd must be used within a CreationDndProvider");
  }
  return context;
};

export const CreationDndProvider: FC<ICreationDndProviderProps> = ({ children }) => {
  const [activeItem, setActiveItem] = useState<IFormElement | null>(null);

  const { formElementsList, setFormElementsList } = useCreation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 },
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    console.log("drag start", active.id);
    document.body.style.cursor = CURSOR_STYLE_GRABBING;
    const activeItem =
      formElementsList
        .flatMap((item) => {
          if (isFormElementSection(item)) {
            const section = item as ISection;
            // Retourne la section et toutes ses questions
            return [section, ...section.questions];
          }
          return [item];
        })
        .find((el) => el.id === active.id) || null;

    setActiveItem(activeItem);
  };

  const handleDragOver = ({ over }: DragMoveEvent) => {
    if (!over || !activeItem) return;

    const activeEl = activeItem;
    const overEl = findFormElementById(formElementsList, over.id as number);
    if (!overEl) return;

    const activeType = getType(activeEl);
    const overType = getType(overEl);

    // SECTION DRAG
    if (activeType === "SECTION") {
      if (overType === "QUESTION_IN_SECTION") return; // interdit
      reorderElements(activeEl.id!, overEl.id!);
    }

    // QUESTION ALONE
    if (activeType === "QUESTION_ALONE") {
      if (overType === "SECTION") {
        moveQuestionToSection(activeEl.id!, overEl.id!);
      } else {
        reorderElements(activeEl.id!, overEl.id!);
      }
    }

    // QUESTION IN SECTION
    if (activeType === "QUESTION_IN_SECTION") {
      if (overType === "QUESTION_IN_SECTION") {
        reorderQuestionInsideSection(activeEl.id!, overEl.id!);
      } else if (overType === "SECTION") {
        moveQuestionToSection(activeEl.id!, overEl.id!);
      } else {
        moveQuestionOutOfSection(activeEl.id!);
        reorderElements(activeEl.id!, overEl.id!);
      }
    }
  };

  const reorderElements = (activeId: number, overId: number) => {
    setFormElementsList((prevs) => {
      const copy = [...prevs];
      const activeIndex = copy.findIndex((el) => el.id === activeId);
      const overIndex = copy.findIndex((el) => el.id === overId);
      if (activeIndex === -1 || overIndex === -1) return prevs;
      const [moved] = copy.splice(activeIndex, 1);
      copy.splice(overIndex, 0, moved);
      return copy;
    });
  };

  const moveQuestionToSection = (questionId: number, sectionId: number) => {
    setFormElementsList((prevs) => {
      const copy = [...prevs];
      const question = copy.find((q) => q.id === questionId) as IQuestion | undefined;
      const section = copy.find((s) => s.id === sectionId) as ISection | undefined;
      if (!question || !section || !isFormElementSection(section)) return prevs;

      // retire de sa position actuelle
      const idx = copy.indexOf(question);
      if (idx > -1) copy.splice(idx, 1);

      // ajoute dans la section.questions
      section.questions.push(question);
      question.sectionId = section.id;
      return copy;
    });
  };

  const moveQuestionOutOfSection = (questionId: number) => {
    setFormElementsList((prev) => {
      const copy = [...prev];
      const question = copy.find((q) => q.id === questionId) as IQuestion | undefined;
      if (!question || !question.sectionId) return prev;
      const section = copy.find((s) => s.id === question.sectionId) as ISection | undefined;
      if (!section) return prev;

      // retire de la section
      section.questions = section.questions.filter((q) => q.id !== question.id);
      question.sectionId = null;

      // insère après la section dans la liste globale
      const sectionIndex = copy.findIndex((s) => s.id === section.id);
      copy.splice(sectionIndex + 1, 0, question);
      return copy;
    });
  };

  const reorderQuestionInsideSection = (activeId: number, overId: number) => {
    setFormElementsList((prev) => {
      const copy = [...prev];
      const active = copy.find((q) => q.id === activeId) as IQuestion | undefined;
      const over = copy.find((q) => q.id === overId) as IQuestion | undefined;
      if (!active || !over || active.sectionId !== over.sectionId) return prev;

      const section = copy.find((s) => s.id === active.sectionId) as ISection | undefined;
      if (!section) return prev;
      const idxActive = section.questions.findIndex((q) => q.id === activeId);
      const idxOver = section.questions.findIndex((q) => q.id === overId);
      const [moved] = section.questions.splice(idxActive, 1);
      section.questions.splice(idxOver, 0, moved);

      return copy;
    });
  };

  const value = useMemo(
    () => ({
      sensors,
      activeItem,
      setActiveItem,
      handleDragStart,
      handleDragOver,
    }),
    [sensors, activeItem, handleDragStart, handleDragOver],
  );

  return <CreationDndProviderContext.Provider value={value}>{children}</CreationDndProviderContext.Provider>;
};
