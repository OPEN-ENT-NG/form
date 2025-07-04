import { DragMoveEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useState } from "react";
import { isFormElement } from "react-router-dom/dist/dom";
import { swapAndSortFormElements } from "~/components/OrganizationSortableItem/utils";
import { IFormElement } from "~/core/models/formElement/types";
import { compareFormElements } from "~/core/models/formElement/utils";
import { IQuestion } from "~/core/models/question/types";
import { isFormElementQuestion } from "~/core/models/question/utils";
import { ISection } from "~/core/models/section/types";
import { isFormElementSection } from "~/core/models/section/utils";
import { removeFormElementFromList, updateElementInList } from "~/providers/CreationProvider/utils";

export const useOrganizationModalDnd = (
  formElementList: IFormElement[],
  setFormElementList: (formElementList: IFormElement[]) => void,
) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);
  // Offset X is used to determine how far the item has been dragged horizontally
  // Used to determine if its top level or nested
  const [offsetX, setOffsetX] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const formElement = event.active.data.current?.element as IFormElement;
    if (formElement.id) {
      setActiveId(formElement.id);
      setOverId(formElement.id);
    }
    // Handle drag start logic here
    console.log("Drag started", event);
  };

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetX(delta.x);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    // const activeElement = formElementList.find((el) => el.id === active.id);
    const overedElement = over?.data.current?.element as IFormElement | undefined;
    const activeElement = active.data.current?.element as IFormElement | undefined;
    console.log(
      "Over Element",
      overedElement?.title,
      "from type",
      overedElement?.formElementType,
      "and id",
      overedElement?.id,
    );
    console.log(
      "ActiveElement Element",
      activeElement?.title,
      "from type",
      activeElement?.formElementType,
      "and id",
      activeElement?.id,
    );
    console.log("Offset X:", offsetX);
    if (!overedElement || !activeElement) {
      setOverId(null);
      return;
    }

    if (!overedElement.id || !activeElement.id) {
      setOverId(null);
      return;
    }

    setOverId(overedElement.id);

    // if (offsetX > 50 && isFormElementQuestion(activeElement) && isFormElementSection(overedElement)) {
    //   const activeQuestion = activeElement as IQuestion;
    //   const overedSection = overedElement as ISection;

    //   const updatedQuestion: IQuestion = {
    //     ...activeQuestion,
    //     position: null,
    //     sectionId: overedSection.id,
    //     sectionPosition: overedSection.questions.length + 1, // Position at the end of the section
    //   };

    //   const updatedSection: ISection = {
    //     ...overedSection,
    //     questions: [...overedSection.questions, updatedQuestion].sort(compareFormElements),
    //   };

    //   setFormElementList(
    //     updateElementInList(removeFormElementFromList(formElementList, activeQuestion), updatedSection),
    //   );
    //   return;
    // }
    // console.log(offsetX < -30,  isFormElementQuestion(activeElement), !!overedElement.position);
    // if (offsetX < -30 && isFormElementQuestion(activeElement) && overedElement.position) {
    //   console.log("Moving question to top level");
    //   const activeQuestion = activeElement as IQuestion;
    //   if (activeQuestion.sectionId) {
    //     const parentSection = formElementList.find(
    //       (el) => el.id === activeQuestion.sectionId && isFormElementSection(el),
    //     ) as ISection | undefined;
    //     if (parentSection) {
    //       const updatedQuestion: IQuestion = {
    //         ...activeQuestion,
    //         position: overedElement.position + 1,
    //         sectionId: null,
    //         sectionPosition: null, // Position at the end of the section
    //       };

    //       const updatedSection = {
    //         ...parentSection,
    //         questions: removeFormElementFromList(parentSection.questions, activeQuestion),
    //       };

    //       setFormElementList(updateElementInList([...formElementList, updatedQuestion], updatedSection));
    //     }
    //   }
    // }

    setFormElementList(swapAndSortFormElements(activeElement, overedElement, formElementList));
  }

  function handleDragEnd() {
    reset();
  }

  function handleDragCancel() {
    reset();
  }

  function reset() {
    setActiveId(null);
    setOverId(null);
    setOffsetX(0);
  }
  return {
    activeId,
    sensors,
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
};
