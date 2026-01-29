import "dayjs/locale/fr";
import "dayjs/locale/en";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { DD_MM_YYYY, HH_MM } from "~/core/constants";
import { t } from "~/i18n";

dayjs.extend(utc);
dayjs.extend(timezone);

export const useFormatDateWithTime = () => {
  return (date: string | Date | undefined | null, i18nTextKey: string): string => {
    if (!date) return "";

    const locale = t("formulaire.date.format.locale");
    dayjs.locale(locale);

    const text = t(i18nTextKey);
    const atText = t("formulaire.at");

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const formattedDate = dayjs(date).tz(userTimeZone).format(DD_MM_YYYY);
    const formattedTime = dayjs(date).tz(userTimeZone).format(HH_MM);

    return `${text}${formattedDate}${atText}${formattedTime}`;
  };
};
