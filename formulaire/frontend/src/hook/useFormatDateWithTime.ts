import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
export const useFormatDateWithTime = () => {
  const { t } = useTranslation(FORMULAIRE);

  return (date: string | Date | undefined): string => {
    if (!date) return "";
    return new Intl.DateTimeFormat(t("formulaire.date.format.locale"), {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };
};
