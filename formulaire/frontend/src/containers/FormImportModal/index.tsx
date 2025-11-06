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
import { IModalProps } from "~/core/types";
import {
  useLazyAnalyzeImportFormsQuery,
  useLazyLaunchImportFormsQuery,
  useUploadImportFormsMutation,
} from "~/services/api/services/archiveApi/importExportApi";
import { useDispatch } from "react-redux";
import { TagName } from "~/core/enums";
import { getAcceptedFileType } from "./utils";
import { IImportAnalyzeResponse, IImportUploadResponse } from "~/core/models/import/types";
import { emptySplitFormulaireApi } from "~/services/api/services/formulaireApi/emptySplitFormulaireApi";
import { toast } from "react-toastify";
import { TypographyVariant } from "~/core/style/themeProps";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";

export const FormImportModal: FC<IModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);
  const dispatch = useDispatch();
  const [customFiles, setCustomFiles] = useState<CustomFile[]>([]);
  const [formData, setFormData] = useState<FormData>(new FormData());

  const [uploadImportForms, { data: uploadedForms = {} as IImportUploadResponse, isSuccess: isUploadSuccess }] =
    useUploadImportFormsMutation();
  const [analyzeImportForms, { data: analyzedForms = {} as IImportAnalyzeResponse, isSuccess: isAnalyzeSuccess }] =
    useLazyAnalyzeImportFormsQuery();
  const [launchImportForms, { isSuccess: isLaunchSuccess }] = useLazyLaunchImportFormsQuery();

  useEffect(() => {
    const handleUploadStep = () => {
      const isUploadOk = isUploadSuccess && !!uploadedForms.importId;
      if (isUploadOk && !isAnalyzeSuccess) {
        void analyzeImportForms(uploadedForms.importId);
      }
      return isUploadOk;
    };

    const handleAnalyzeStep = (isUploadOk: boolean) => {
      const isAnalyzeOk = isUploadOk && isAnalyzeSuccess && !!analyzedForms.importId && !!analyzedForms.apps;
      if (isAnalyzeOk && !isLaunchSuccess) {
        void launchImportForms({
          importId: analyzedForms.importId,
          apps: analyzedForms.apps,
        });
      }
      return isAnalyzeOk;
    };

    const handleLaunchStep = (isUploadOk: boolean, isAnalyzeOk: boolean) => {
      const isLaunchOk = isUploadOk && isAnalyzeOk && isLaunchSuccess;
      if (isLaunchOk) {
        dispatch(emptySplitFormulaireApi.util.invalidateTags([TagName.FORMS]));
        toast.success(t("formulaire.success.forms.import"));
        handleClose();
      }
    };
    const isUploadOk = handleUploadStep();
    const isAnalyzeOk = handleAnalyzeStep(isUploadOk);
    handleLaunchStep(isUploadOk, isAnalyzeOk);
  }, [isUploadSuccess, isAnalyzeSuccess, isLaunchSuccess, uploadedForms.importId, analyzedForms.apps, dispatch]);

  const handleDropFile = (files: File[]) => {
    const zipFile = files[0];
    const newFormData = new FormData();
    newFormData.append("file", zipFile);
    setFormData(newFormData);

    const { name, size } = zipFile;
    setCustomFiles([{ name, size, isDeletable: true }]);
  };

  const handleImport = async () => {
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
        <Typography color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H2} fontWeight={TypographyFontStyle.BOLD}>
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
        <FileList
          files={customFiles}
          onDelete={() => {
            setCustomFiles([]);
          }}
        ></FileList>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          {t("formulaire.close")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            void handleImport();
          }}
        >
          {t("formulaire.import")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
