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

export const CsvResultModal: FC = () => {
  const {
    toggleModal,
    displayModals: { [ModalType.FORM_RESULT_CSV]: csvResult },
  } = useGlobal();

  const handleCloseModal = () => {
    toggleModal(ModalType.FORM_RESULT_CSV);
  };

  return (
    <Dialog open={csvResult} onClose={handleCloseModal}>
      <DialogTitle>{t("formulaire.form.download.all.results.lightbox.title", { 0: "csv" })}</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <DialogContentText>
            {t("formulaire.form.download.all.results.lightbox.description.p1", { 0: "csv" })}
          </DialogContentText>
          <DialogContentText>{t("formulaire.form.download.all.results.lightbox.description.p2")}</DialogContentText>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>{t("formulaire.cancel")}</Button>
        <Button variant={ComponentVariant.CONTAINED}>{t("formulaire.confirm")}</Button>
      </DialogActions>
    </Dialog>
  );
};
