import { FC, useCallback } from "react";
import { EllipsisWithTooltip, ResourceCard } from "@cgi-learning-hub/ui";
import { DD_MM_YYYY, FORMULAIRE, HH_MM, LOGO_PATH } from "~/core/constants";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { ISentFormProps } from "./types";
import { IForm } from "~/core/models/form/types";
import { IDistribution } from "~/core/models/distribution/types";
import { PRIMARY_MAIN_COLOR, TEXT_SECONDARY_COLOR } from "~/core/style/colors";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

export const SentForm: FC<ISentFormProps> = ({ form, distributions, isSelected, onSelect }) => {

  const { t } = useTranslation(FORMULAIRE);
  const formatDateWithTime = (date: string | Date | undefined): string => {
    if (!date) return "";

    const locale = t("formulaire.date.format.locale");
    dayjs.locale(locale);

    const modifiedText = t("formulaire.sentAt");
    const atText = t("formulaire.at");
    const formattedDate = dayjs(date).format(DD_MM_YYYY);
    const formattedTime = dayjs(date).format(HH_MM);

    return `${modifiedText}${formattedDate}${atText}${formattedTime}`;
  };

  console.log("form", form);
  console.log("distributions", distributions);


  const getPropertyItems = useCallback(
    (form: IForm, distributions: IDistribution[]) => {
      return [
        {
          icon: <AccountBoxRoundedIcon sx={{ color: PRIMARY_MAIN_COLOR }} />,
          text: (
            <EllipsisWithTooltip typographyProps={{ color: TEXT_SECONDARY_COLOR }}>
              {form.owner_name}
            </EllipsisWithTooltip>
          ),
        },
        {
          icon: <CalendarIcon sx={{ color: PRIMARY_MAIN_COLOR }} />,
          text: (
            <EllipsisWithTooltip typographyProps={{ color: TEXT_SECONDARY_COLOR }}>
              {formatDateWithTime(form.date_creation)}
            </EllipsisWithTooltip>
          ),
        },
        {
          icon: <CheckCircleRoundedIcon sx={{ color: PRIMARY_MAIN_COLOR }} />,
          text: (
            <EllipsisWithTooltip typographyProps={{ color: TEXT_SECONDARY_COLOR }}>
              {t("formulaire.sentTo")}
              {distributions.length > 0
                ? distributions.map((distribution, index) => (
                    <span key={distribution.id}>
                      {index > 0 && ", "}
                      {distribution.sender_name}
                    </span>
                  ))
                : t("formulaire.nobody")}
            </EllipsisWithTooltip>
          ),
        },
      ];
    },
    [t, formatDateWithTime],
  );


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
      propertyItems={getPropertyItems(form, distributions)}
      hasNoButtonOnFocus
    />
  );
};
