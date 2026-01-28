import { Box, ResourceCard } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { LOGO_PATH } from "~/core/constants";
import { isSelectedForm } from "~/core/models/form/utils";
import { cardPreviewStyle } from "~/core/style/dndStyle";
import { useFormItemsIcons } from "~/hook/useFormItemsIcons";
import { useHome } from "~/providers/HomeProvider";

import { IFormPreviewProps } from "./types";

export const FormPreview: FC<IFormPreviewProps> = ({ form }) => {
  const { selectedForms } = useHome();
  const { getIcons, getFormPropertyItems } = useFormItemsIcons();

  return (
    <Box data-type="dnd-preview" sx={{ ...cardPreviewStyle }}>
      <ResourceCard
        key={form.id}
        width="30rem"
        title={form.title}
        image={form.picture}
        defaultImage={LOGO_PATH}
        isSelected={isSelectedForm(form, selectedForms)}
        propertyItems={getFormPropertyItems(form)}
        infoIcons={getIcons(form)}
      />
    </Box>
  );
};
