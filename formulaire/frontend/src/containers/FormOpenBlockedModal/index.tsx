import { Button, DialogActions, DialogContent, DialogTitle, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { ResponsiveDialog } from "~/components/ResponsiveDialog";
import { FORMULAIRE } from "~/core/constants";
import { PRIMARY, TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { ComponentVariant, TypographyFontStyle, TypographyVariant } from "~/core/style/themeProps";
import { IModalProps } from "~/core/types";

export const FormOpenBlockedModal: FC<IModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);

  return (
    <ResponsiveDialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <Typography color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H2} fontWeight={TypographyFontStyle.BOLD}>
          {t("formulaire.modal.open.form.blocked.title")}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant={TypographyVariant.BODY1}>{t("formulaire.modal.open.form.blocked.body")}</Typography>
      </DialogContent>

      <DialogActions>
        <Button variant={ComponentVariant.OUTLINED} color={PRIMARY} onClick={handleClose}>
          {t("formulaire.close")}
        </Button>
      </DialogActions>
    </ResponsiveDialog>
  );
};
