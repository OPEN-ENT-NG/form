import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { t } from "~/i18n";

export const useGetCreationHeaderButtons = (): IButtonProps[] => {
  return [
    {
      title: t("formulaire.return"),
      variant: ComponentVariant.OUTLINED,
      action: () => {},
    },
    {
      title: t("formulaire.visualize.path"),
      variant: ComponentVariant.OUTLINED,
      action: () => {},
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
