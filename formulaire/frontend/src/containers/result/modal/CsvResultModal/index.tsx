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
import { toast } from "react-toastify";

import { ModalType } from "~/core/enums";
import { ComponentVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useGlobal } from "~/providers/GlobalProvider";
import { useResult } from "~/providers/ResultProvider";
import { useExportResponsesCsvMutation } from "~/services/api/services/formulaireApi/responseApi";

export const CsvResultModal: FC = () => {
  const {
    toggleModal,
    displayModals: { [ModalType.FORM_RESULT_CSV]: csvResult },
  } = useGlobal();

  const { formId } = useResult();

  const [exportResponsesCsv, { isLoading }] = useExportResponsesCsvMutation();

  const handleCloseModal = () => {
    toggleModal(ModalType.FORM_RESULT_CSV);
  };

  const handleExportCsv = async () => {
    try {
      await exportResponsesCsv(formId).unwrap();
      handleCloseModal();
    } catch (err) {
      toast.error(t("formulaire.error.responseService.export"));
      console.error("Error exporting CSV:", err);
    }
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
        <Button loading={isLoading} variant={ComponentVariant.CONTAINED} onClick={() => void handleExportCsv()}>
          {t("formulaire.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
