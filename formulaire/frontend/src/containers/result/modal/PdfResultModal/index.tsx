import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@cgi-learning-hub/ui";
import { FC } from "react";

import { ModalType } from "~/core/enums";
import { ComponentVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useGlobal } from "~/providers/GlobalProvider";

export const PdfResultModal: FC = () => {
  const {
    toggleModal,
    displayModals: { [ModalType.FORM_RESULT_PDF]: pdfResult },
  } = useGlobal();

  const handleCloseModal = () => {
    toggleModal(ModalType.FORM_RESULT_PDF);
  };

  return (
    <Dialog open={pdfResult} onClose={handleCloseModal}>
      <DialogTitle>{t("formulaire.form.download.all.results.lightbox.title", { 0: "pdf" })}</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <DialogContentText>
            {t("formulaire.form.download.all.results.lightbox.description.p1", { 0: "pdf" })}
          </DialogContentText>
          <DialogContentText>{t("formulaire.form.download.all.results.lightbox.description.p2")}</DialogContentText>
          <DialogContentText>{t("formulaire.form.download.all.results.lightbox.description.p3")}</DialogContentText>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>{t("formulaire.cancel")}</Button>
        <Button variant={ComponentVariant.CONTAINED}>{t("formulaire.confirm")}</Button>
      </DialogActions>
    </Dialog>
  );
};
