import { useCallback } from "react";
import PublicIcon from "@mui/icons-material/Public";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShareIcon from "@mui/icons-material/Share";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { IForm } from "~/core/models/form/types";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { ERROR_MAIN_COLOR, PRIMARY_MAIN_COLOR, SUCCESS_MAIN_COLOR, TEXT_SECONDARY_COLOR } from "~/core/style/colors";
import { EllipsisWithTooltip, Tooltip } from "@cgi-learning-hub/ui";
import { useFormatDateWithTime } from "./useFormatDateWithTime";
import { getFormNbResponsesText, getFormStatusText, isFormFilled } from "~/core/models/form/utils";
import { IDistribution } from "~/core/models/distribution/types";
import { getFirstDistributionDate } from "~/core/models/distribution/utils";
import { t } from "~/i18n";

export const useFormItemsIcons = () => {
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

  const getFormPropertyItems = useCallback((form: IForm) => {
    return [
      {
        icon: (
          <Tooltip title={t("formulaire.owner")} placement="top" disableInteractive>
            <AccountBoxRoundedIcon sx={{ color: PRIMARY_MAIN_COLOR }} />
          </Tooltip>
        ),
        text: (
          <EllipsisWithTooltip slotProps={{ text: { color: TEXT_SECONDARY_COLOR } }}>
            {form.owner_name}
          </EllipsisWithTooltip>
        ),
      },
      {
        icon: <CalendarIcon sx={{ color: PRIMARY_MAIN_COLOR }} />,
        text: (
          <EllipsisWithTooltip slotProps={{ text: { color: TEXT_SECONDARY_COLOR } }}>
            {formatDateWithTime(form.date_modification, "formulaire.modified")}
          </EllipsisWithTooltip>
        ),
      },
      {
        icon: <AssignmentTurnedInIcon sx={{ color: PRIMARY_MAIN_COLOR }} />,
        text: (
          <EllipsisWithTooltip slotProps={{ text: { color: TEXT_SECONDARY_COLOR } }}>
            {getFormNbResponsesText(form.nb_responses ?? 0)}
          </EllipsisWithTooltip>
        ),
      },
    ];
  }, []);

  const getSentFormPropertyItems = useCallback((form: IForm, distributions: IDistribution[]) => {
    return [
      {
        icon: (
          <Tooltip title={t("formulaire.owner")} placement="top" disableInteractive>
            <AccountBoxRoundedIcon sx={{ color: PRIMARY_MAIN_COLOR }} />
          </Tooltip>
        ),
        text: (
          <EllipsisWithTooltip slotProps={{ text: { color: TEXT_SECONDARY_COLOR } }}>
            {form.owner_name}
          </EllipsisWithTooltip>
        ),
      },
      {
        icon: <CalendarIcon sx={{ color: PRIMARY_MAIN_COLOR }} />,
        text: (
          <EllipsisWithTooltip slotProps={{ text: { color: TEXT_SECONDARY_COLOR } }}>
            {formatDateWithTime(getFirstDistributionDate(distributions), "formulaire.sentAt")}
          </EllipsisWithTooltip>
        ),
      },
      {
        icon: (
          <CheckCircleRoundedIcon
            sx={{ color: isFormFilled(form, distributions) ? SUCCESS_MAIN_COLOR : ERROR_MAIN_COLOR }}
          />
        ),
        text: (
          <EllipsisWithTooltip
            slotProps={{
              text: {
                color: isFormFilled(form, distributions) ? SUCCESS_MAIN_COLOR : ERROR_MAIN_COLOR,
              },
            }}
          >
            {getFormStatusText(form, distributions, formatDateWithTime)}
          </EllipsisWithTooltip>
        ),
      },
    ];
  }, []);

  return { getIcons, getFormPropertyItems, getSentFormPropertyItems };
};
