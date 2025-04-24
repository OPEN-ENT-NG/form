import { FC, useCallback, useEffect, useRef, useState } from "react";

import { Box, Loader } from "@cgi-learning-hub/ui";

import { FORM_CHUNK } from "~/core/constants";
import { IForm } from "~/core/models/form/types";
import { useHome } from "~/providers/HomeProvider";
import { IHomeMainSentFormsProps } from "./types";
import { SentForm } from "~/components/SentForm";
import { getFormDistributions } from "~/core/models/form/utils";
import { cardWrapperStyle } from "~/core/style/boxStyles";
import { sentFormWrapperStyle } from "./style";

export const HomeMainSentForms: FC<IHomeMainSentFormsProps> = ({ sentForms, distributions }) => {
  const { selectedSentForm, setSelectedSentForm } = useHome();
  const [visibleCount, setVisibleCount] = useState(FORM_CHUNK);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const handleFormsSelect = useCallback(
    (form: IForm) => {
      setSelectedSentForm(selectedSentForm ? (selectedSentForm.id === form.id ? null : form) : form);
      return;
    },
    [selectedSentForm, setSelectedSentForm],
  );

  const isSelectedForm = (form: IForm) => !!selectedSentForm && selectedSentForm.id === form.id;

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

  return (
    <>
      <Box sx={sentFormWrapperStyle}>
        {sentForms.slice(0, visibleCount).map((form) => {
          return (
            <SentForm
              key={form.id}
              form={form}
              distributions={getFormDistributions(form, distributions)}
              isSelected={isSelectedForm}
              handleSelect={handleFormsSelect}
            />
          );
        })}
      </Box>
      <Box ref={targetRef} />
      {visibleCount < sentForms.length && <Loader />}
    </>
  );
};
