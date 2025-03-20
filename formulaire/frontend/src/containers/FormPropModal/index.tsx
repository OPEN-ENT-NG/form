import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  ImagePicker,
  TextField,
  DatePicker,
  Checkbox,
  Tooltip,
  Select,
  FormControl,
  MenuItem,
  Button,
} from "@cgi-learning-hub/ui";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  fileDropZoneWrapper,
  formPropModalWrapper,
  mainColumnStyle,
  mainContentWrapper,
  subContentColumnWrapper,
  subContentRowWrapper,
  textFieldStyle,
  checkboxRowStyle,
  dateEndingCheckboxStyle,
  rgpdContentRowStyle,
  modalActionsStyle,
  datePickerWrapperStyle,
} from "./style";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";
import { FormPropModalProps } from "./types";
import { FormPropField, FormPropModalMode } from "./enums";
import { useFormPropInputValueState } from "./useFormPropValueState";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import dayjs from "dayjs";
import { buildDelegatesParam, buildFormPayload, formCheckBoxProps, rgpdGoalDurationOptions } from "./utils";
import { GREY_DARK_COLOR } from "~/core/style/colors";
import RGPDInfoBox from "~/components/RgpdInfoBox";
import { useGetDelegatesQuery } from "~/services/api/services/delegateApi";

export const FormPropModal: FC<FormPropModalProps> = ({ isOpen, handleClose, mode, isRgpdPossible }) => {
  const {
    formPropInputValue,
    formPropInputValue: { dateOpening, isPublic, description, hasRgpd, rgpdGoal, rgpdLifeTime, title },
    handleFormPropInputValueChange,
    handleDateChange,
  } = useFormPropInputValueState();
  const { t } = useTranslation(FORMULAIRE);
  const [isEndingDateEditable, setIsEndingDateEditable] = useState<boolean>(false);
  const [isDescriptionDisplay, setIsDescriptionDisplay] = useState<boolean>(false);
  const { data: delegateData } = useGetDelegatesQuery();

  const formCheckBoxPropsReady = useMemo(() => {
    return isRgpdPossible
      ? formCheckBoxProps
      : formCheckBoxProps.filter((item) => item.field !== FormPropField.HAS_RGPD);
  }, [isRgpdPossible]);

  const rgpdExpirationDate = useMemo(() => {
    return dayjs(dateOpening).add(rgpdLifeTime, "month");
  }, [dateOpening, rgpdLifeTime]);

  const delegateParam = useMemo(() => {
    return buildDelegatesParam(delegateData ?? null, rgpdGoal, rgpdExpirationDate);
  }, [delegateData, rgpdGoal, rgpdExpirationDate]);

  const modalTitle = useMemo(
    () => (mode === FormPropModalMode.CREATE ? t("formulaire.prop.create.title") : t("formulaire.prop.update.title")),
    [mode],
  );

  const handleCheckboxChange = useCallback(
    (field: FormPropField) => {
      if (field === FormPropField.DESCRIPTION) {
        return setIsDescriptionDisplay(!isDescriptionDisplay);
      }
      if (field === FormPropField.IS_PUBLIC) {
        setIsEndingDateEditable(!formPropInputValue[field]);
        handleFormPropInputValueChange(FormPropField.IS_ANONYMOUS, !formPropInputValue[field]);
        return handleFormPropInputValueChange(field, !formPropInputValue[field]);
      }
      return handleFormPropInputValueChange(field, !formPropInputValue[field]);
    },
    [
      formPropInputValue,
      isDescriptionDisplay,
      setIsDescriptionDisplay,
      setIsEndingDateEditable,
      handleFormPropInputValueChange,
    ],
  );

  const handleSubmit = () => {
    console.log({ state: formPropInputValue, payload: buildFormPayload(formPropInputValue) });
  };

  useEffect(() => {
    if (isEndingDateEditable) {
      const openingDate = new Date(dateOpening);

      const endingDate = new Date(openingDate);
      endingDate.setFullYear(openingDate.getFullYear() + 1);

      return handleFormPropInputValueChange(FormPropField.DATE_ENDING, endingDate);
    }
    return handleFormPropInputValueChange(FormPropField.DATE_ENDING, null);
  }, [isEndingDateEditable, dateOpening, handleFormPropInputValueChange]);

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
              onFileChange={(file) => handleFormPropInputValueChange(FormPropField.PICTURE, file?.name ?? "")}
            />
          </Box>
          <Box sx={mainContentWrapper}>
            <Box sx={subContentColumnWrapper}>
              <Typography variant="h4">{t("formulaire.form.create.title")}</Typography>
              <TextField
                variant="standard"
                sx={textFieldStyle}
                placeholder={t("formulaire.form.create.placeholder")}
                value={formPropInputValue[FormPropField.TITLE]}
                onChange={(e) => handleFormPropInputValueChange(FormPropField.TITLE, e.target.value)}
                inputProps={{ style: { width: "100%" } }}
              />
            </Box>
            <Box sx={subContentRowWrapper}>
              <Typography>{t("formulaire.date.opening")}</Typography>
              <Box sx={datePickerWrapperStyle}>
                <DatePicker
                  minDate={dayjs()}
                  value={dayjs(formPropInputValue[FormPropField.DATE_OPENING])}
                  onChange={(value) => handleDateChange(FormPropField.DATE_OPENING, value)}
                />
              </Box>
              <Box sx={dateEndingCheckboxStyle}>
                <Checkbox
                  sx={{ padding: "0" }}
                  disabled={isPublic}
                  checked={isEndingDateEditable}
                  onChange={() => setIsEndingDateEditable(!isEndingDateEditable)}
                />
                <Typography>{t("formulaire.date.ending")}</Typography>
              </Box>
              {isEndingDateEditable && (
                <Box sx={datePickerWrapperStyle}>
                  <DatePicker
                    minDate={dayjs(dateOpening).add(1, "day")}
                    value={dayjs(formPropInputValue[FormPropField.DATE_ENDING])}
                    onChange={(value) => handleDateChange(FormPropField.DATE_ENDING, value)}
                  />
                </Box>
              )}
            </Box>
            <Box sx={subContentColumnWrapper}>
              {formCheckBoxPropsReady.map((item) => {
                const isDisabled =
                  item.field === FormPropField.IS_ANONYMOUS ||
                  item.field === FormPropField.IS_MULTIPLE ||
                  item.field === FormPropField.IS_EDITABLE
                    ? isPublic
                    : false;
                const isChecked =
                  item.field === FormPropField.DESCRIPTION
                    ? isDescriptionDisplay
                    : (formPropInputValue[item.field] as boolean);
                const showDescription = isDescriptionDisplay && item.field === FormPropField.DESCRIPTION;
                const showRgpd = item.field === FormPropField.HAS_RGPD && isRgpdPossible && hasRgpd;
                return (
                  <>
                    <Box key={item.field} sx={checkboxRowStyle}>
                      <Checkbox
                        sx={{ padding: "0" }}
                        disabled={isDisabled}
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(item.field)}
                      />
                      <Typography>{t(item.i18nKey)}</Typography>
                      {!!item.tooltip && (
                        <Tooltip title={t(item.tooltip)}>
                          <InfoOutlinedIcon color="secondary" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                    {showDescription && (
                      <Box>
                        <TextField
                          sx={{ maxWidth: "50rem" }}
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={4}
                          placeholder={t("formulaire.prop.description.placeholder")}
                          value={description}
                          onChange={(e) => handleFormPropInputValueChange(FormPropField.DESCRIPTION, e.target.value)}
                        />
                        <Typography color={GREY_DARK_COLOR} fontStyle="italic">
                          {t("formulaire.prop.description.description")}
                        </Typography>
                      </Box>
                    )}
                    {showRgpd && (
                      <Box>
                        <Box sx={rgpdContentRowStyle}>
                          <Typography>{t("formulaire.prop.rgpd.goal")}</Typography>
                          <TextField
                            variant="standard"
                            sx={textFieldStyle}
                            placeholder={t("formulaire.prop.rgpd.goal.input")}
                            value={rgpdGoal}
                            onChange={(e) => handleFormPropInputValueChange(FormPropField.RGPD_GOAL, e.target.value)}
                            inputProps={{
                              maxLength: 150,
                              style: { width: "100%" },
                            }}
                          />
                          <Tooltip title={t("formulaire.prop.rgpd.goal.description")}>
                            <InfoOutlinedIcon color="secondary" fontSize="small" />
                          </Tooltip>
                        </Box>
                        <Box sx={rgpdContentRowStyle}>
                          <Typography>{t("formulaire.prop.rgpd.lifetime")}</Typography>
                          <FormControl variant="outlined">
                            <Select
                              variant="standard"
                              labelId="duration-select-label"
                              id="duration-select"
                              value={rgpdLifeTime}
                              onChange={(e) =>
                                handleFormPropInputValueChange(FormPropField.RGPD_LIFE_TIME, e.target.value)
                              }
                              label={t("common.duration.label")}
                            >
                              {rgpdGoalDurationOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {`${option} ${t("formulaire.months")}`}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <RGPDInfoBox params={delegateParam} />
                      </Box>
                    )}
                  </>
                );
              })}
            </Box>
          </Box>
        </Box>
        <Box sx={modalActionsStyle}>
          <Button onClick={handleClose}>{t("formulaire.cancel")}</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!title.length}>
            {t("formulaire.save")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
