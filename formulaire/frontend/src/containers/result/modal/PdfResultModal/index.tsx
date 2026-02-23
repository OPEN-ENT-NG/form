import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@cgi-learning-hub/ui";
import { FC, useState } from "react";

import { ModalType } from "~/core/enums";
import { ComponentVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useGlobal } from "~/providers/GlobalProvider";
import { useResult } from "~/providers/ResultProvider";
import {
  useCreateFilesForPdfExportMutation,
  useExportResponsesPdfMutation,
} from "~/services/api/services/formulaireApi/responseApi";

import { useGeneratePdf } from "./hook/UseGeneratePdf";
import { buildImagesPayload } from "./utils";

export const PdfResultModal: FC = () => {
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);

  const {
    toggleModal,
    displayModals: { [ModalType.FORM_RESULT_PDF]: pdfResult },
  } = useGlobal();

  const { formElementList, getDistributionMap, formId } = useResult();

  const { generatePdfFormData } = useGeneratePdf(formElementList, getDistributionMap);
  const [createFilesForPdfExport] = useCreateFilesForPdfExportMutation();
  const [exportResponsesPdf] = useExportResponsesPdfMutation();

  const handleGeneratePdf = async () => {
    setIsPdfLoading(true);
    try {
      const { filesFormData, nbFiles } = await generatePdfFormData();
      const uploadedFiles = await createFilesForPdfExport({ filesFormData, nbFiles }).unwrap();
      const imagesPayload = buildImagesPayload(uploadedFiles);
      await exportResponsesPdf({
        formId,
        images: imagesPayload,
      });
    } finally {
      setIsPdfLoading(false);
      handleCloseModal();
    }
  };

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
        <Button disabled={isPdfLoading} onClick={handleCloseModal}>
          {t("formulaire.cancel")}
        </Button>
        <Button loading={isPdfLoading} variant={ComponentVariant.CONTAINED} onClick={() => void handleGeneratePdf()}>
          {t("formulaire.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
