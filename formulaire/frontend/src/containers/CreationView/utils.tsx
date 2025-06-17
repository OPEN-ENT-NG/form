import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { t } from "~/i18n";
import { getFormTreePath } from "~/core/pathHelper";
import { useNavigate } from "react-router-dom";

export const useGetCreationHeaderButtons = (formId: string | number | undefined): IButtonProps[] => {
  const navigate = useNavigate();
  return [
    {
      title: t("formulaire.return"),
      variant: ComponentVariant.OUTLINED,
      action: () => { navigate('/')},
    },
    {
      title: t("formulaire.visualize.path"),
      variant: ComponentVariant.OUTLINED,
      action: () => { formId ? window.location.href = getFormTreePath(formId) : null},
    },
    {
      title: t("formulaire.organize"),
      variant: ComponentVariant.OUTLINED,
      action: () => {},
    },
    {
      title: t("formulaire.preview"),
      variant: ComponentVariant.OUTLINED,
      action: () => {},
    },
    {
      title: t("formulaire.save"),
      variant: ComponentVariant.CONTAINED,
      action: () => {},
      startIcon: <SaveRoundedIcon />,
    },
  ];
};
