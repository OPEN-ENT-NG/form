import { IModalProps } from "~/core/types";
import { FC } from "react";
import { Button, Typography, DialogTitle, DialogContent, DialogActions } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { PRIMARY } from "~/core/style/colors";
import { ComponentVariant, TypographyFont, TypographyVariant } from "~/core/style/themeProps";
import { ResponsiveDialog } from "~/components/ResponsiveDialog";

export const FormOpenBlockedModal: FC<IModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);

  return (
    <ResponsiveDialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <Typography variant={TypographyVariant.H2} fontWeight={TypographyFont.BOLD}>
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
