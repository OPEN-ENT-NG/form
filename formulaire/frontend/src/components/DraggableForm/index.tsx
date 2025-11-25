import { FC } from "react";
import { IDraggableFormProps } from "./types";
import { useDraggable } from "@dnd-kit/core";
import { DraggableType, SizeAbreviation } from "~/core/enums";
import { Box, ResourceCard } from "@cgi-learning-hub/ui";
import { useFormItemsIcons } from "~/hook/useFormItemsIcons";
import { FORMULAIRE, LOGO_PATH } from "~/core/constants";

import { dragActiveStyle } from "~/core/style/dndStyle";
import { getFormEditPath } from "~/core/pathHelper";
import { useGlobal } from "~/providers/GlobalProvider";
import { useNavigate } from "react-router-dom";

export const DraggableForm: FC<IDraggableFormProps> = ({ form, isSelected, onSelect, dragActive = false }) => {
  const { isMobile } = useGlobal();
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `draggable-form-${form.id.toString()}`,
    data: { type: DraggableType.FORM, form },
    disabled: isMobile,
  });
  const navigate = useNavigate();
  const { getIcons, getFormPropertyItems } = useFormItemsIcons();

  return (
    <Box ref={setNodeRef} sx={{ ...(dragActive ? dragActiveStyle : {}) }} {...attributes} {...listeners}>
      <ResourceCard
        key={form.id}
        width="30rem"
        title={form.title}
        image={form.picture ?? undefined}
        defaultImage={LOGO_PATH}
        isSelected={isSelected(form)}
        onSelect={() => {
          onSelect(form);
        }}
        onClick={() => {
          if (isMobile) {
            onSelect(form);
            return;
          }
          navigate(`/form/${form.id}/edit`);
        }}
        propertyItems={getFormPropertyItems(form)}
        infoIcons={getIcons(form)}
        hasNoButtonOnFocus
        size={isMobile ? SizeAbreviation.SMALL : SizeAbreviation.MEDIUM}
      />
    </Box>
  );
};
