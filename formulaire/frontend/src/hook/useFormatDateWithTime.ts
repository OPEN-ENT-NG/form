import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "dayjs/locale/en";
import { DateFormat } from "~/core/enums";

export const useFormatDateWithTime = () => {
  const { t } = useTranslation(FORMULAIRE);

  return (date: string | Date | undefined): string => {
    if (!date) return "";
    const locale = t("formulaire.date.format.locale");
    dayjs.locale(locale);
    return dayjs(date).format(DateFormat.FULL_DATE_WITH_TIME_FORMAT);
  };
};
