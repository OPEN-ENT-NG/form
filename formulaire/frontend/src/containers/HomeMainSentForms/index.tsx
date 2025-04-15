import { FC, useCallback, useEffect, useRef, useState } from "react";

import { Box, Loader } from "@cgi-learning-hub/ui";

import { FORM_CHUNK } from "~/core/constants";
import { IForm } from "~/core/models/form/types";
import { useHome } from "~/providers/HomeProvider";
import { IHomeMainSentFormsProps } from "./types";
import { SentForm } from "~/components/SentForm";

export const HomeMainSentForms: FC<IHomeMainSentFormsProps> = ({ sentForms, distributions }) => {
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
      if (entries[0].isIntersecting && visibleCount < sentForms.length) {
        setVisibleCount((prev) => Math.min(prev + FORM_CHUNK, sentForms.length));
      }
    },
    [visibleCount, sentForms.length],
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
  }, [sentForms, handleObserver]);

  const getFormDistributions = useCallback(
    (form: IForm) => {
      const distribs = distributions.filter((distribution) => distribution.formId === form.id);
      return distribs;
    },
    [distributions],
  );


  return (
    <>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {sentForms.slice(0, visibleCount).map((form) => {
          return (
            <SentForm
              key={form.id}
              form={form}
              distributions={getFormDistributions(form)}
              isSelected={isSelectedForm}
              onSelect={handleFormsSelect}
            />
          );
        })}
      </Box>
      <Box ref={targetRef}></Box>
      {visibleCount < sentForms.length && <Loader />}
    </>
  );
};
