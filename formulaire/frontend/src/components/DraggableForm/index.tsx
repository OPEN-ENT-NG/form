import { Box, ResourceCard } from "@cgi-learning-hub/ui";
import { useDraggable } from "@dnd-kit/core";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { LOGO_PATH } from "~/core/constants";
import { DraggableType, SizeAbreviation } from "~/core/enums";
import { getFormEditPath } from "~/core/pathHelper";
import { dragActiveStyle } from "~/core/style/dndStyle";
import { useFormItemsIcons } from "~/hook/useFormItemsIcons";
import { useGlobal } from "~/providers/GlobalProvider";

import { IDraggableFormProps } from "./types";

export const DraggableForm: FC<IDraggableFormProps> = ({ form, isSelected, onSelect, dragActive = false }) => {
  const { isMobile } = useGlobal();
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `draggable-form-${form.id.toString()}`,
    data: { type: DraggableType.FORM, form },
    disabled: isMobile,
  });

  const { getIcons, getFormPropertyItems } = useFormItemsIcons();

  return (
    <Box ref={setNodeRef} sx={{ ...(dragActive ? dragActiveStyle : {}), width: "100%" }} {...attributes} {...listeners}>
      <ResourceCard
        key={form.id}
        width="100%"
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
          navigate(getFormEditPath(form.id));
        }}
        propertyItems={getFormPropertyItems(form)}
        infoIcons={getIcons(form)}
        hasNoButtonOnFocus
        size={isMobile ? SizeAbreviation.SMALL : SizeAbreviation.MEDIUM}
      />
    </Box>
  );
};
