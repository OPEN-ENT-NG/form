import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

export const useGetCreationHeaderButtons = (): IButtonProps[] => {
  return [
    {
      titleI18nkey: "formulaire.return",
      variant: ComponentVariant.OUTLINED,
      action: () => {},
    },
    {
      titleI18nkey: "formulaire.visualize.path",
      variant: ComponentVariant.OUTLINED,
      action: () => {},
    },
    {
      titleI18nkey: "formulaire.organize",
      variant: ComponentVariant.OUTLINED,
      action: () => {},
    },
    {
      titleI18nkey: "formulaire.preview",
      variant: ComponentVariant.OUTLINED,
      action: () => {},
    },
    {
      titleI18nkey: "formulaire.save",
      variant: ComponentVariant.CONTAINED,
      action: () => {},
      startIcon: <SaveRoundedIcon />,
    },
  ];
};
