import { Box, Loader } from "@cgi-learning-hub/ui";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import { DraggableForm } from "~/components/DraggableForm";
import { FORM_CHUNK } from "~/core/constants";
import { DraggableType } from "~/core/enums";
import { IForm } from "~/core/models/form/types";
import { cardWrapperStyle } from "~/core/style/boxStyles";
import { useHome } from "~/providers/HomeProvider";

import { IHomeMainFormsProps } from "./types";

export const HomeMainForms: FC<IHomeMainFormsProps> = ({ forms, activeItem = null }) => {
  const { selectedForms, setSelectedForms } = useHome();
  const [visibleCount, setVisibleCount] = useState(FORM_CHUNK);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const handleFormsSelect = useCallback(
    (form: IForm) => {
      if (selectedForms.some((f) => f.id === form.id)) {
        setSelectedForms(selectedForms.filter((f) => f.id !== form.id));
        return;
      }
      setSelectedForms([...selectedForms, form]);
    },
    [selectedForms, setSelectedForms],
  );

  const isSelectedForm = (form: IForm) => selectedForms.some((f) => f.id === form.id);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && visibleCount < forms.length) {
        setVisibleCount((prev) => Math.min(prev + FORM_CHUNK, forms.length));
      }
    },
    [visibleCount, forms.length],
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observerRef.current.observe(currentTarget);
    }

    return () => {
      if (observerRef.current && currentTarget) {
        observerRef.current.unobserve(currentTarget);
      }
    };
  }, [forms, handleObserver]);

  return (
    <>
      <Box sx={cardWrapperStyle}>
        {forms.slice(0, visibleCount).map((form) => (
          <DraggableForm
            key={form.id}
            form={form}
            isSelected={isSelectedForm}
            onSelect={handleFormsSelect}
            dragActive={
              !!activeItem &&
              (activeItem.type === DraggableType.FORM || activeItem.type === DraggableType.FOLDER) &&
              selectedForms.some((f) => f.id === form.id)
            }
          />
        ))}
      </Box>
      <Box ref={targetRef} />
      {visibleCount < forms.length && <Loader />}
    </>
  );
};
