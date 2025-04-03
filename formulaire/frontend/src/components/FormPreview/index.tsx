import { FC } from "react";
import { Box, ResourceCard } from "@cgi-learning-hub/ui";
import { LOGO_PATH } from "~/core/constants";
import { isSelectedForm } from "~/core/models/form/utils";
import { useHome } from "~/providers/HomeProvider";
import { FormPreviewProps } from "./types";
import { useFormItemsIcons } from "~/hook/useFormItemsIcons";
import { cardPreviewStyle } from "~/core/style/dndStyle";

export const FormPreview: FC<FormPreviewProps> = ({ form }) => {
  const { selectedForms } = useHome();
  const { getIcons, getPropertyItems } = useFormItemsIcons();

  return (
    <Box data-type="dnd-preview" sx={{ ...cardPreviewStyle }}>
      <ResourceCard
        key={form.id}
        width="30rem"
        title={form.title}
        image={form.picture}
        defaultImage={LOGO_PATH}
        isSelected={isSelectedForm(form, selectedForms)}
        propertyItems={getPropertyItems(form)}
        infoIcons={getIcons(form)}
      />
    </Box>
  );
};
