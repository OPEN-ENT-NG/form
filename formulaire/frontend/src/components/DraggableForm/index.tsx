import { FC } from "react";
import { IDraggableFormProps } from "./types";
import { useDraggable } from "@dnd-kit/core";
import { DraggableType } from "~/core/enums";
import { Box, ResourceCard } from "@cgi-learning-hub/ui";
import { useFormItemsIcons } from "~/hook/useFormItemsIcons";
import { LOGO_PATH } from "~/core/constants";

import { dragActiveStyle } from "~/core/style/dndStyle";
import { getFormEditPath } from "~/core/pathHelper";

export const DraggableForm: FC<IDraggableFormProps> = ({ form, isSelected, onSelect, dragActive = false }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `draggable-form-${form.id.toString()}`,
    data: { type: DraggableType.FORM, form },
  });

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
          window.location.href = getFormEditPath(form.id);
        }}
        propertyItems={getFormPropertyItems(form)}
        infoIcons={getIcons(form)}
        hasNoButtonOnFocus
      />
    </Box>
  );
};
