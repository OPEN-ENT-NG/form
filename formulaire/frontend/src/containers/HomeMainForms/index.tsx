import { FC, useCallback, useEffect, useRef, useState } from "react";

import { ResourceCard, EllipsisWithTooltip, Box, Loader } from "@cgi-learning-hub/ui";

import { HomeMainFormsProps } from "./types";
import { FORM_CHUNK, FORMULAIRE, LOGO_PATH } from "~/core/constants";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PersonIcon from "@mui/icons-material/Person";
import { PRIMARY_MAIN_COLOR, TEXT_SECONDARY_COLOR } from "~/core/style/colors";
import { useFormatDateWithTime } from "~/hook/useFormatDateWithTime";
import { useTranslation } from "react-i18next";
import { useFormIcons } from "../HomeMainLayout/useFormIcons";
import { Form } from "~/core/models/form/types";
import { useHome } from "~/providers/HomeProvider";

export const HomeMainForms: FC<HomeMainFormsProps> = ({ forms }) => {
  const { selectedForms, setSelectedForms } = useHome();

  const { t } = useTranslation(FORMULAIRE);
  const getIcons = useFormIcons();
  const formatDateWithTime = useFormatDateWithTime();

  const [visibleCount, setVisibleCount] = useState(FORM_CHUNK);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const handleFormsSelect = useCallback(
    (form: Form) => {
      if (selectedForms.some((f) => f.id === form.id)) {
        return setSelectedForms(selectedForms.filter((f) => f.id !== form.id));
      }
      return setSelectedForms([...selectedForms, form]);
    },
    [selectedForms, setSelectedForms],
  );

  const isSelectedForm = (form: Form) => selectedForms.some((f) => f.id === form.id);

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
      <Box display="flex" flexWrap="wrap" gap={2} >
        {forms.slice(0, visibleCount).map((form) => (
          <ResourceCard
            key={form.id} 
            width="30rem"
            title={form.title}
            image={form.picture}
            defaultImage={LOGO_PATH}
            isSelected={isSelectedForm(form)}
            onSelect={() => handleFormsSelect(form)}
            propertyItems={[
              {
                icon: <PersonIcon sx={{ color: PRIMARY_MAIN_COLOR }} />,
                text: (
                  <EllipsisWithTooltip typographyProps={{ color: TEXT_SECONDARY_COLOR }}>
                    {form.owner_name}
                  </EllipsisWithTooltip>
                ),
              },
              {
                icon: <AssignmentTurnedInIcon sx={{ color: PRIMARY_MAIN_COLOR }} />,
                text: (
                  <EllipsisWithTooltip typographyProps={{ color: TEXT_SECONDARY_COLOR }}>
                    {`${form.nb_responses ?? "0"} ${t("formulaire.responses.count")}`}
                  </EllipsisWithTooltip>
                ),
              },
              {
                icon: <CalendarIcon sx={{ color: PRIMARY_MAIN_COLOR }} />,
                text: (
                  <EllipsisWithTooltip typographyProps={{ color: TEXT_SECONDARY_COLOR }}>
                    {formatDateWithTime(form.date_creation)}
                  </EllipsisWithTooltip>
                ),
              },
            ]}
            infoIcons={getIcons(form)}
          />
        ))}
      </Box>
      <Box ref={targetRef}></Box>
      {visibleCount < forms.length && <Loader />}
    </>
  );
};
