import { Box, Button, Dropzone, FileList, IconButton, Modal, Typography } from "@cgi-learning-hub/ui";
import CloseIcon from "@mui/icons-material/Close";
import { FC, useEffect, useState } from "react";
import { modalBoxStyle, spaceBetweenBoxStyle } from "~/core/style/boxStyles";
import { formImportModalContentStyle, formImportModalStyle } from "./style";
import { modalActionButtonStyle } from "~/core/style/modalStyle";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ModalProps } from "~/types";
import {
  useLazyAnalyzeImportFormsQuery,
  useLazyLaunchImportFormsQuery,
  useUploadImportFormsMutation,
} from "~/services/api/services/archiveApi/importExportApi";
import { useDispatch } from "react-redux";
import { TagName } from "~/core/enums";
import { emptySplitArchiveApi } from "~/services/api/services/archiveApi/emptySplitArchiveApi";
import { getAcceptedFileType } from "./utils";
import { CustomFile } from "@cgi-learning-hub/ui";
import { ImportAnalyzeResponse, ImportUploadResponse } from "~/core/models/import/types";

export const FormImportModal: FC<ModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);
  const dispatch = useDispatch();
  const [customFiles, setCustomFiles] = useState<CustomFile[]>([]);
  const [formData, setFormData] = useState<FormData>(new FormData());

  const [uploadImportForms, { data: uploadedForms = {} as ImportUploadResponse, isSuccess: isUploadSuccess }] =
    useUploadImportFormsMutation();
  const [analyzeImportForms, { data: analyzedForms = {} as ImportAnalyzeResponse, isSuccess: isAnalyzeSuccess }] =
    useLazyAnalyzeImportFormsQuery();
  const [launchImportForms, { isSuccess: isLaunchSuccess }] = useLazyLaunchImportFormsQuery();

  useEffect(() => {
    const isUploadOk = isUploadSuccess && uploadedForms.importId;
    if (isUploadOk && !isAnalyzeSuccess) {
      analyzeImportForms(uploadedForms.importId);
    }

    const isAnalyzeOk = isUploadOk && isAnalyzeSuccess && analyzedForms.importId && analyzedForms.apps;
    if (isAnalyzeOk && !isLaunchSuccess) {
      launchImportForms({ importId: analyzedForms.importId, apps: analyzedForms.apps });
    }

    const isLaunchOk = isUploadOk && isAnalyzeOk && isLaunchSuccess;
    if (isLaunchOk) {
      dispatch(emptySplitArchiveApi.util.invalidateTags([TagName.FORMS]));
      handleClose();
    }
  }, [isUploadSuccess, isAnalyzeSuccess, isLaunchSuccess, uploadedForms.importId, analyzedForms.apps, dispatch]);

  const handleDropFile = (files: File[]) => {
    if (files.length > 0) {
      // Create FormData from File
      const zipFile = files[0];
      const newFormData = new FormData();
      newFormData.append("file", zipFile);
      setFormData(newFormData);

      // Display file in FileList
      const { name, size } = zipFile;
      setCustomFiles([{ name, size, isDeletable: true }]);
    }
  };

  const handleImport = async () => {
    if (!formData) return;
    try {
      await uploadImportForms(formData);
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={{ ...modalBoxStyle, ...formImportModalStyle }}>
        <Box sx={spaceBetweenBoxStyle}>
          <Typography variant="h2" fontWeight="bold">
            {t("formulaire.import")}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={formImportModalContentStyle}>
          <Typography>{t("formulaire.import.explanation")}</Typography>
          <Dropzone
            information={t("formulaire.import.dropzone.information")}
            accept={getAcceptedFileType()}
            maxFiles={1}
            onDrop={handleDropFile}
          />
          <FileList files={customFiles} onDelete={() => setCustomFiles([])}></FileList>
        </Box>
        <Box sx={modalActionButtonStyle}>
          <Button variant="outlined" color="primary" onClick={handleClose}>
            {t("formulaire.close")}
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleImport()}>
            {t("formulaire.import")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
