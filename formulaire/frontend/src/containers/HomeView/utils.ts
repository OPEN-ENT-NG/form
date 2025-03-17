import { HeaderButton } from "~/components/Header/types";
import { ModalType } from "~/core/enums";
import { ButtonVariant } from "~/core/style/themeProps";

export const getHomeHeaderButtons = (): HeaderButton[] => {
  return [
    {
      titleI18nkey: "formulaire.form.import.button",
      variant: ButtonVariant.OUTLINED,
      modalType: ModalType.IMPORT,
    },
    {
      titleI18nkey: "formulaire.form.create.button",
      variant: ButtonVariant.CONTAINED,
      modalType: ModalType.CREATE,
    },
  ];
};
