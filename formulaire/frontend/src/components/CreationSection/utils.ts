import { ISection } from "~/core/models/section/types";
import { t } from "~/i18n";

export const isDescriptionEmpty = (section: ISection) => {
  if (!section.description) return true;

  const container: HTMLDivElement = document.createElement("div");
  container.innerHTML = section.description;

  return container.textContent?.trim().length === 0;
};

export const getDescription = (section: ISection): string | null => {
  if (isDescriptionEmpty(section)) return t("formulaire.section.no.description");
  return section.description;
};
