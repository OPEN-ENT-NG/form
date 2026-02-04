import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";
import { t } from "~/i18n";

export const getHeaderButtonsProps = (pdfAction: () => void, csvAction: () => void): IButtonProps[] => [
  {
    title: t("formulaire.form.download.all.results.pdf"),
    variant: ComponentVariant.OUTLINED,
    action: pdfAction,
  },
  {
    title: t("formulaire.form.download.all.results.csv"),
    action: csvAction,
  },
];
