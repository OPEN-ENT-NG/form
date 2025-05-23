import { FC } from "react";
import { ResourceCard } from "@cgi-learning-hub/ui";
import { LOGO_PATH } from "~/core/constants";
import { ISentFormProps } from "./types";
import { useFormItemsIcons } from "~/hook/useFormItemsIcons";
import { useMapActionBarButtons } from "~/containers/HomeView/useMapActionBarButtons";

export const SentForm: FC<ISentFormProps> = ({ form, distributions, isSelected, handleSelect }) => {
  const { getSentFormPropertyItems } = useFormItemsIcons();
  const { openFormResponseAction } = useMapActionBarButtons();
  return (
    <ResourceCard
      key={form.id}
      width="30rem"
      title={form.title}
      image={form.picture}
      defaultImage={LOGO_PATH}
      isSelected={isSelected(form)}
      onSelect={() => {
        handleSelect(form);
      }}
      onClick={() => {
        void openFormResponseAction(form);
      }}
      propertyItems={getSentFormPropertyItems(form, distributions)}
      hasNoButtonOnFocus
    />
  );
};
