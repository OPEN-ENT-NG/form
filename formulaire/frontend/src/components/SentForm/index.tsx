import { ResourceCard } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { useMapActionBarButtons } from "~/containers/HomeView/useMapActionBarButtons";
import { LOGO_PATH } from "~/core/constants";
import { SizeAbreviation } from "~/core/enums";
import { useFormItemsIcons } from "~/hook/useFormItemsIcons";
import { useGlobal } from "~/providers/GlobalProvider";

import { ISentFormProps } from "./types";

export const SentForm: FC<ISentFormProps> = ({ form, distributions, isSelected, handleSelect }) => {
  const { isMobile } = useGlobal();
  const { getSentFormPropertyItems } = useFormItemsIcons();
  const { openFormResponseAction } = useMapActionBarButtons();

  return (
    <ResourceCard
      key={form.id}
      width="100%"
      title={form.title}
      {...(form.picture && { image: form.picture })}
      defaultImage={LOGO_PATH}
      isSelected={isSelected(form)}
      onSelect={() => {
        handleSelect(form);
      }}
      onClick={() => {
        if (isMobile) handleSelect(form);
        else void openFormResponseAction(form);
      }}
      propertyItems={getSentFormPropertyItems(form, distributions)}
      hasNoButtonOnFocus
      size={isMobile ? SizeAbreviation.SMALL : SizeAbreviation.MEDIUM}
    />
  );
};
