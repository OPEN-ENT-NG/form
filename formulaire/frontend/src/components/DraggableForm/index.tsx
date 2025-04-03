import { FC } from "react";
import { DraggableFormProps } from "./types";
import { useDraggable } from "@dnd-kit/core";
import { DraggableType } from "~/core/enums";
import { Box, ResourceCard } from "@cgi-learning-hub/ui";
import { useFormItemsIcons } from "~/hook/useFormItemsIcons";
import { LOGO_PATH } from "~/core/constants";

import { dragActiveStyle } from "~/core/style/dndStyle";

export const DraggableForm: FC<DraggableFormProps> = ({ form, isSelected, onSelect, dragActive = false }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `draggable-form-${form.id}`,
    data: { type: DraggableType.FORM, form },
  });

  const { getIcons, getPropertyItems } = useFormItemsIcons();

  return (
    <Box ref={setNodeRef} sx={{ ...(dragActive ? dragActiveStyle : {}) }} {...attributes} {...listeners}>
      <ResourceCard
        key={form.id}
        width="30rem"
        title={form.title}
        image={form.picture}
        defaultImage={LOGO_PATH}
        isSelected={isSelected(form)}
        onSelect={() => onSelect(form)}
        propertyItems={getPropertyItems(form)}
        infoIcons={getIcons(form)}
      />
    </Box>
  );
};
