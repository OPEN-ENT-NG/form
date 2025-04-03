import {
  Button,
  CustomFile,
  Dropzone,
  FileList,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@cgi-learning-hub/ui";

import { FC, useEffect, useState } from "react";

import { dropZoneSlotProps, formImportModalContentStyle, formImportModalStyle } from "./style";
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
import { getAcceptedFileType } from "./utils";
import { ImportAnalyzeResponse, ImportUploadResponse } from "~/core/models/import/types";
import { emptySplitFormulaireApi } from "~/services/api/services/formulaireApi/emptySplitFormulaireApi";
import { toast } from "react-toastify";

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
      dispatch(emptySplitFormulaireApi.util.invalidateTags([TagName.FORMS]));
      toast.success(t("formulaire.success.forms.import"));
      handleClose();
    }
  }, [isUploadSuccess, isAnalyzeSuccess, isLaunchSuccess, uploadedForms.importId, analyzedForms.apps, dispatch]);

  const handleDropFile = (files: File[]) => {
    if (files) {
      const zipFile = files[0];
      const newFormData = new FormData();
      newFormData.append("file", zipFile);
      setFormData(newFormData);

      const { name, size } = zipFile;
      setCustomFiles([{ name, size, isDeletable: true }]);
    }
  };

  const handleImport = async () => {
    if (!formData) return;
    try {
      await uploadImportForms(formData);
    } catch (error) {
      console.error("Error from import:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: formImportModalStyle,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h2" fontWeight="bold">
          {t("formulaire.import")}
        </Typography>
      </DialogTitle>

      <DialogContent sx={formImportModalContentStyle}>
        <Typography>{t("formulaire.import.explanation")}</Typography>
        <Dropzone
          information={t("formulaire.import.dropzone.information")}
          accept={getAcceptedFileType()}
          maxFiles={1}
          width={"30rem"}
          slotProps={dropZoneSlotProps}
          onDrop={handleDropFile}
        />
        <FileList files={customFiles} onDelete={() => setCustomFiles([])}></FileList>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          {t("formulaire.close")}
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleImport()}>
          {t("formulaire.import")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
