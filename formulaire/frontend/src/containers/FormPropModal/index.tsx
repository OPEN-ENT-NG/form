import { FC, useMemo } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  ImagePicker,
  TextField,
  DatePicker,
} from "@cgi-learning-hub/ui";
import CloseIcon from "@mui/icons-material/Close";
import {
  fileDropZoneWrapper,
  formPropModalWrapper,
  mainColumnStyle,
  mainContentWrapper,
  subContentColumnWrapper,
  subContentRowWrapper,
  textFieldStyle,
} from "./style";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";
import { FormPropField, FormPropModalProps } from "./types";
import { FormPropModalMode } from "./enums";
import { useFormPropInputValueState } from "./useFormPropValueState";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import dayjs from "dayjs";

export const FormPropModal: FC<FormPropModalProps> = ({
  isOpen,
  handleClose,
  mode,
}) => {
  const { formPropInputValue, handleFormPropInputValueChange } =
    useFormPropInputValueState();
  const { t } = useTranslation(FORMULAIRE);
  const modalTitle = useMemo(
    () =>
      mode === FormPropModalMode.CREATE
        ? t("formulaire.prop.create.title")
        : t("formulaire.prop.update.title"),
    [mode],
  );

  const handleImageChange = (file: File | null) => {
    if (file) {
      handleFormPropInputValueChange(FormPropField.PICTURE, file?.name);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormPropInputValueChange(FormPropField.TITLE, e.target.value);
  };
  const handleDateChange = (
    field: FormPropField.DATE_OPENING | FormPropField.DATE_ENDING,
    value: dayjs.Dayjs | null,
  ) => {
    if (value) {
      handleFormPropInputValueChange(field, value.toDate());
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={formPropModalWrapper}>
        <Box sx={spaceBetweenBoxStyle}>
          <Typography variant="h2" fontWeight="bold">
            {modalTitle}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="h4">{t("formulaire.prop.edit.title")}</Typography>
        <Box sx={mainColumnStyle}>
          <Box sx={fileDropZoneWrapper}>
            <ImagePicker
              width="16rem"
              height="16.3rem"
              information="SVG, PNG, JPG, GIF"
              onFileChange={handleImageChange}
            />
          </Box>
          <Box sx={mainContentWrapper}>
            <Box sx={subContentColumnWrapper}>
              <Typography variant="h4">
                {t("formulaire.form.create.title")}
              </Typography>
              <TextField
                variant="standard"
                sx={textFieldStyle}
                placeholder={t("formulaire.form.create.placeholder")}
                value={formPropInputValue[FormPropField.TITLE]}
                onChange={handleTitleChange}
                inputProps={{ style: { width: "100%" } }}
              />
            </Box>
            <Box sx={subContentRowWrapper}>
              <Typography variant="body1">
                {t("formulaire.date.opening")}
              </Typography>
              <DatePicker
                value={dayjs(formPropInputValue[FormPropField.DATE_OPENING])}
                onChange={(value) =>
                  handleDateChange(FormPropField.DATE_OPENING, value)
                }
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
