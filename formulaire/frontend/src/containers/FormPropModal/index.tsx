import { FC, useMemo } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@cgi-learning-hub/ui";
import CloseIcon from "@mui/icons-material/Close";
import { formPropModalWrapper } from "./style";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";
import { FormPropModalProps } from "./types";
import { FormPropModalMode } from "./enums";
import { t } from "i18next";

export const FormPropModal: FC<FormPropModalProps> = ({
  isOpen,
  handleClose,
  mode,
}) => {
  const modalTitle = useMemo(
    () =>
      mode === FormPropModalMode.CREATE
        ? t("formulaire.prop.create.title")
        : t("formulaire.prop.create.title"),
    [mode],
  );
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
      </Box>
    </Modal>
  );
};
