import { FC } from "react";
import { ResourceCard } from "@cgi-learning-hub/ui";
import { LOGO_PATH } from "~/core/constants";
import { ISentFormProps } from "./types";
import { useFormItemsIcons } from "~/hook/useFormItemsIcons";
import { useMapActionBarButtons } from "~/containers/HomeView/useMapActionBarButtons";
import { SizeAbreviation } from "~/core/enums";
import { useHome } from "~/providers/HomeProvider";

export const SentForm: FC<ISentFormProps> = ({ form, distributions, isSelected, handleSelect }) => {
  const { isMobile } = useHome();
  const { getSentFormPropertyItems } = useFormItemsIcons();
  const { openFormResponseAction } = useMapActionBarButtons();

  return (
    <ResourceCard
      key={form.id}
      width="30rem"
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
