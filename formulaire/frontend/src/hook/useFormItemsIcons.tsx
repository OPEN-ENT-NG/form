import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import PublicIcon from "@mui/icons-material/Public";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShareIcon from "@mui/icons-material/Share";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { IForm } from "~/core/models/form/types";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PersonIcon from "@mui/icons-material/Person";
import { PRIMARY_MAIN_COLOR, TEXT_SECONDARY_COLOR } from "~/core/style/colors";
import { EllipsisWithTooltip } from "@cgi-learning-hub/ui";
import { useFormatDateWithTime } from "./useFormatDateWithTime";
import { FORMULAIRE } from "~/core/constants";

export const useFormItemsIcons = () => {
  const { t } = useTranslation(FORMULAIRE);
  const formatDateWithTime = useFormatDateWithTime();

  const getIcons = useCallback((form: IForm) => {
    const iconsConfigList = [
      {
        condition: form.collab,
        textKey: "formulaire.shared",
        IconComponent: ShareIcon,
      },
      {
        condition: form.sent && !form.archived,
        textKey: "formulaire.sent",
        IconComponent: ForwardToInboxIcon,
      },
      {
        condition: form.reminded && !form.is_public,
        textKey: "formulaire.reminded",
        IconComponent: NotificationsIcon,
      },
      {
        condition: form.is_public,
        textKey: "formulaire.public",
        IconComponent: PublicIcon,
      },
    ];

    return (
      iconsConfigList
        .filter(({ condition }) => condition)
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .map(({ textKey, IconComponent }) => ({
          text: t(textKey),
          icon: <IconComponent sx={{ color: (theme) => theme.palette.grey.darker }} />,
        }))
    );
  }, []);

  const getPropertyItems = useCallback(
    (form: IForm) => {
      return [
        {
          icon: <PersonIcon sx={{ color: PRIMARY_MAIN_COLOR }} />,
          text: (
            <EllipsisWithTooltip typographyProps={{ color: TEXT_SECONDARY_COLOR }}>
              {form.owner_name}
            </EllipsisWithTooltip>
          ),
        },
        {
          icon: <AssignmentTurnedInIcon sx={{ color: PRIMARY_MAIN_COLOR }} />,
          text: (
            <EllipsisWithTooltip typographyProps={{ color: TEXT_SECONDARY_COLOR }}>
              {`${(form.nb_responses ?? 0).toString()} ${t("formulaire.responses.count")}`}
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
      ];
    },
    [t, formatDateWithTime],
  );

  return { getIcons, getPropertyItems };
};
