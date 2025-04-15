import { FC } from "react";
import { ResourceCard } from "@cgi-learning-hub/ui";
import { LOGO_PATH } from "~/core/constants";
import { ISentFormProps } from "./types";
import { useFormItemsIcons } from "~/hook/useFormItemsIcons";

export const SentForm: FC<ISentFormProps> = ({ form, distributions, isSelected, onSelect }) => {
  const { getSentFormPropertyItems } = useFormItemsIcons();

  return (
    <ResourceCard
      key={form.id}
      width="30rem"
      title={form.title}
      image={form.picture}
      defaultImage={LOGO_PATH}
      isSelected={isSelected(form)}
      onSelect={() => {
        onSelect(form);
      }}
      propertyItems={getSentFormPropertyItems(form, distributions)}
      hasNoButtonOnFocus
    />
  );
};
