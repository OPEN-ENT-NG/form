import { DD_MM_YYYY, HH_MM } from "~/core/constants";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "dayjs/locale/en";
import i18n from "~/i18n";

export const useFormatDateWithTime = () => {
  return (date: string | Date | undefined | null, i18nTextKey: string): string => {
    if (!date) return "";

    const locale = i18n.t("formulaire.date.format.locale");
    dayjs.locale(locale);

    const text = i18n.t(i18nTextKey);
    const atText = i18n.t("formulaire.at");
    const formattedDate = dayjs(date).format(DD_MM_YYYY);
    const formattedTime = dayjs(date).format(HH_MM);

    return `${text}${formattedDate}${atText}${formattedTime}`;
  };
};
