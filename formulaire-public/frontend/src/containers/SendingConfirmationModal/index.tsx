import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { BreakpointVariant, ComponentVariant, TypographyFontStyle, TypographyVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useResponse } from "~/providers/ResponseProvider";
import { useSendResponsesMutation } from "~/services/api/formulairePublicApi/responseApi";

import { ISendingConfirmationModalProps } from "./types";

export const SendingConfirmationModal: FC<ISendingConfirmationModalProps> = ({
  isOpen,
  handleClose,
  captchaResponse,
}) => {
  const navigate = useNavigate();
  const { formKey, form, flattenResponses } = useResponse();
  const [sendResponses] = useSendResponsesMutation();

  const send = async () => {
    if (!form?.distribution_key || !flattenResponses.length) return;
    await sendResponses({
      formKey,
      distributionKey: form.distribution_key,
      captchaResponse,
      responses: flattenResponses,
    });
    navigate("/thanks");
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth={BreakpointVariant.MD}>
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
        <Button
          variant={ComponentVariant.CONTAINED}
          onClick={() => {
            void send();
          }}
        >
          {t("formulaire.public.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
