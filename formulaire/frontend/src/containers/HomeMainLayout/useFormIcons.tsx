import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import PublicIcon from "@mui/icons-material/Public";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShareIcon from "@mui/icons-material/Share";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { Form } from "~/core/models/form/types";

export const useFormIcons = () => {
  const { t } = useTranslation();

  const getIcons = useCallback((form: Form) => {
    const icons = [
      ...(form.collab
        ? [
            {
              text: t("formulaire.shared"),
              icon: <ShareIcon sx={{ color: (theme) => theme.palette.grey.darker }} />,
            },
          ]
        : []),
      ...(form.sent && !form.archived
        ? [
            {
              text: t("formulaire.sent"),
              icon: <ForwardToInboxIcon sx={{ color: (theme) => theme.palette.grey.darker }} />,
            },
          ]
        : []),
      ...(form.reminded && !form.is_public
        ? [
            {
              text: t("formulaire.reminded"),
              icon: <NotificationsIcon sx={{ color: (theme) => theme.palette.grey.darker }} />,
            },
          ]
        : []),
      ...(form.is_public
        ? [
            {
              text: t("formulaire.public"),
              icon: <PublicIcon sx={{ color: (theme) => theme.palette.grey.darker }} />,
            },
          ]
        : []),
    ];
    return icons;
  }, []);

  return getIcons;
};
