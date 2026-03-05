import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { BreakpointVariant, ComponentVariant, TypographyFontStyle, TypographyVariant } from "~/core/style/themeProps";
import { isEnterPressed } from "~/core/utils";
import { t } from "~/i18n";

import { ISendingConfirmationModalProps } from "./types";

export const SendingConfirmationModal: FC<ISendingConfirmationModalProps> = ({
  isOpen,
  handleClose,
  onSendingConfirmation,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth={BreakpointVariant.MD}
      onKeyDown={(e) => {
        if (isEnterPressed(e)) onSendingConfirmation();
      }}
    >
      <DialogTitle color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H2} fontWeight={TypographyFontStyle.BOLD}>
        {t("formulaire.public.responses.send.title")}
      </DialogTitle>
      <DialogContent>
        <Typography>{t("formulaire.public.responses.send.text")}</Typography>
        <Typography>{t("formulaire.public.responses.send.continue")}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant={ComponentVariant.OUTLINED} onClick={handleClose}>
          {t("formulaire.public.cancel")}
        </Button>
        <Button variant={ComponentVariant.CONTAINED} onClick={onSendingConfirmation}>
          {t("formulaire.public.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
