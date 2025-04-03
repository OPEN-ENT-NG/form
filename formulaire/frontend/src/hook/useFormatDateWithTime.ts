import { useTranslation } from "react-i18next";
import { DD_MM_YYYY, FORMULAIRE, HH_MM } from "~/core/constants";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "dayjs/locale/en";

export const useFormatDateWithTime = () => {
  const { t } = useTranslation(FORMULAIRE);

  return (date: string | Date | undefined): string => {
    if (!date) return "";

    const locale = t("formulaire.date.format.locale");
    dayjs.locale(locale);

    const modifiedText = t("formulaire.modified");
    const atText = t("formulaire.at");
    const formattedDate = dayjs(date).format(DD_MM_YYYY);
    const formattedTime = dayjs(date).format(HH_MM);

    return `${modifiedText}${formattedDate}${atText}${formattedTime}`;
  };
};
