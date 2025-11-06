import { IModalProps } from "~/core/types";
import { ChangeEvent, FC, useState } from "react";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Loader,
  Radio,
  RadioGroup,
} from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";

import { BreakpointVariant, ComponentVariant, TypographyFontStyle, TypographyVariant } from "~/core/style/themeProps";
import { ExportFormat } from "./enum";
import { dialogContentStyle, exportContainerStyle, radioGroupStyle } from "./style";
import { useExportZipMutation, useLazyExportPdfFormQuery } from "~/services/api/services/formulaireApi/formApi";
import { useHome } from "~/providers/HomeProvider";
import { useVerifyExportAndDownloadZipMutation } from "~/services/api/services/archiveApi/importExportApi";
import { ResponsiveDialog } from "~/components/ResponsiveDialog";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";

export const ExportModal: FC<IModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { selectedForms } = useHome();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(ExportFormat.ZIP);
  const [isLoading, setIsLoading] = useState(false);
  const [exportPdf] = useLazyExportPdfFormQuery();
  const [exportZip] = useExportZipMutation();
  const [verifyExportAndDownloadZip] = useVerifyExportAndDownloadZipMutation();

  const handleFormatChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFormat(event.target.value as ExportFormat);
  };

  const handleExport = async () => {
    try {
      if (selectedFormat === ExportFormat.ZIP) {
        setIsLoading(true);
        const formIds = selectedForms.map((form) => form.id);
        const exportId = await exportZip(formIds).unwrap();
        if (exportId) {
          await verifyExportAndDownloadZip(exportId).unwrap();
        }
        setIsLoading(false);
      }
      if (selectedFormat === ExportFormat.PDF) {
        const notEmptySelectedForms = selectedForms.filter((form) => form.nb_elements > 0);
        await exportPdf(notEmptySelectedForms);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error exporting form:", error);
    }
    handleClose();
  };

  return (
    <ResponsiveDialog open={isOpen} onClose={handleClose} maxWidth={BreakpointVariant.MD} fullWidth>
      <DialogTitle color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H2} fontWeight={TypographyFontStyle.BOLD}>
        {t("formulaire.export")}
      </DialogTitle>
      <DialogContent sx={dialogContentStyle}>
        <Box>
          <Typography variant={TypographyVariant.BODY1}>{t("formulaire.export.choice.format")}</Typography>
        </Box>
        <RadioGroup value={selectedFormat} onChange={handleFormatChange} sx={radioGroupStyle}>
          <Box sx={exportContainerStyle}>
            <Radio value={ExportFormat.ZIP} />
            <Box
              onClick={() => {
                setSelectedFormat(ExportFormat.ZIP);
              }}
            >
              <Typography variant={TypographyVariant.BODY1} fontWeight={TypographyFontStyle.BOLD}>
                {t("formulaire.format.zip")}
              </Typography>
              <Typography variant={TypographyVariant.BODY1}>{t("formulaire.export.explanation.zip")}</Typography>
            </Box>
          </Box>
          <Box sx={exportContainerStyle}>
            <Radio value={ExportFormat.PDF} />
            <Box
              onClick={() => {
                setSelectedFormat(ExportFormat.PDF);
              }}
            >
              <Typography variant={TypographyVariant.BODY1} fontWeight={TypographyFontStyle.BOLD}>
                {t("formulaire.format.pdf")}
              </Typography>
              <Typography variant={TypographyVariant.BODY1}>{t("formulaire.export.explanation.pdf")}</Typography>
            </Box>
          </Box>
        </RadioGroup>
        {isLoading && <Loader />}
      </DialogContent>
      <DialogActions>
        <Button variant={ComponentVariant.OUTLINED} onClick={handleClose}>
          {t("formulaire.cancel")}
        </Button>
        <Button
          variant={ComponentVariant.CONTAINED}
          onClick={() => {
            void handleExport();
          }}
        >
          {t("formulaire.export")}
        </Button>
      </DialogActions>
    </ResponsiveDialog>
  );
};
