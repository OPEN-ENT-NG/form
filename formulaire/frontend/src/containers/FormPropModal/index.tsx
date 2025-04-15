import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Typography,
  TextField,
  DatePicker,
  Checkbox,
  Tooltip,
  Select,
  FormControl,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@cgi-learning-hub/ui";
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

import { IFormPropModalProps } from "./types";
import { FormPropField, FormPropModalMode } from "./enums";
import { useFormPropInputValueState } from "./useFormPropValueState";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, IMAGE_PICKER_INFO } from "~/core/constants";
import dayjs from "dayjs";
import { buildDelegatesParam, formCheckBoxProps, rgpdGoalDurationOptions } from "./utils";
import { GREY_DARK_COLOR } from "~/core/style/colors";
import RGPDInfoBox from "~/components/RgpdInfoBox";
import { useGetDelegatesQuery } from "~/services/api/services/formulaireApi/delegateApi";
import { useHome } from "~/providers/HomeProvider";
import { useCreateFormMutation, useUpdateFormMutation } from "~/services/api/services/formulaireApi/formApi";
import { buildFormPayload } from "~/core/models/form/utils";
import { ComponentVariant, TypographyFont, TypographyVariant } from "~/core/style/themeProps";
import { ImagePickerMediaLibrary } from "~/components/ImagePickerMediaLibrary";
import { spaceBetweenBoxStyle } from "~/core/style/boxStyles";

export const FormPropModal: FC<IFormPropModalProps> = ({ isOpen, handleClose, mode, isRgpdPossible }) => {
  const {
    selectedForms,
    currentFolder: { id: currentFolderId },
  } = useHome();
  const {
    formPropInputValue,
    formPropInputValue: { dateOpening, isPublic, description, hasRgpd, rgpdGoal, rgpdLifeTime, title },
    handleFormPropInputValueChange,
    handleDateChange,
    formId,
  } = useFormPropInputValueState(mode);
  const { t } = useTranslation(FORMULAIRE);
  const [isEndingDateEditable, setIsEndingDateEditable] = useState<boolean>(
    mode === FormPropModalMode.UPDATE && !!selectedForms[0]?.date_ending,
  );
  const [isDescriptionDisplay, setIsDescriptionDisplay] = useState<boolean>(
    mode === FormPropModalMode.UPDATE && !!selectedForms[0]?.description,
  );
  const { data: delegateData } = useGetDelegatesQuery();
  const [createForm] = useCreateFormMutation();
  const [updateForm] = useUpdateFormMutation();

  //MEDIA LIBRARY
  const handleImageChange = useCallback(
    (src: string | null) => {
      handleFormPropInputValueChange(FormPropField.PICTURE, src ?? "");
    },
    [handleFormPropInputValueChange],
  );

  const formCheckBoxPropsReadyList = useMemo(() => {
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
    () => (mode === FormPropModalMode.CREATE ? t("formulaire.prop.create.title") : t("formulaire.prop.edit.title")),
    [mode, t],
  );

  const handleCheckboxChange = useCallback(
    (field: FormPropField) => {
      if (field === FormPropField.DESCRIPTION) {
        setIsDescriptionDisplay(!isDescriptionDisplay);
        return;
      }
      if (field === FormPropField.IS_PUBLIC) {
        setIsEndingDateEditable(!formPropInputValue[field]);
        handleFormPropInputValueChange(FormPropField.IS_ANONYMOUS, !formPropInputValue[field]);
        handleFormPropInputValueChange(field, !formPropInputValue[field]);
        return;
      }
      handleFormPropInputValueChange(field, !formPropInputValue[field]);
    },
    [
      formPropInputValue,
      isDescriptionDisplay,
      setIsDescriptionDisplay,
      setIsEndingDateEditable,
      handleFormPropInputValueChange,
    ],
  );

  const handleSubmit = useCallback(async () => {
    const formInEdit = mode === FormPropModalMode.UPDATE ? selectedForms[0] : null;
    const formPayload = buildFormPayload(formPropInputValue, currentFolderId, formInEdit);

    const submitActions = {
      [FormPropModalMode.CREATE]: () => createForm(formPayload),
      [FormPropModalMode.UPDATE]: () =>
        updateForm({
          payload: formPayload,
          formId,
        }),
    };

    try {
      await submitActions[mode]().unwrap();
      handleClose();
    } catch (error) {
      console.error("Submit error:", error);
    }
  }, [createForm, updateForm, mode, formId, formPropInputValue, currentFolderId, handleClose, selectedForms]);

  useEffect(() => {
    if (isEndingDateEditable) {
      const openingDate = new Date(dateOpening);

      const endingDate = new Date(openingDate);
      endingDate.setFullYear(openingDate.getFullYear() + 1);

      handleFormPropInputValueChange(FormPropField.DATE_ENDING, endingDate);
      return;
    }
    handleFormPropInputValueChange(FormPropField.DATE_ENDING, null);
  }, [isEndingDateEditable, dateOpening, handleFormPropInputValueChange]);

  useEffect(() => {
    if (!isDescriptionDisplay) {
      handleFormPropInputValueChange(FormPropField.DESCRIPTION, "");
      return;
    }
    return;
  }, [isDescriptionDisplay, handleFormPropInputValueChange]);

  const formContent = (
    <>
      <Typography mb={"1rem"}>{t("formulaire.prop.edit.title")}</Typography>
      <Box sx={mainColumnStyle}>
        <Box sx={fileDropZoneWrapper}>
          <ImagePickerMediaLibrary
            width="16rem"
            height="16.3rem"
            information={IMAGE_PICKER_INFO}
            onImageChange={handleImageChange}
            initialSrc={formPropInputValue[FormPropField.PICTURE]}
          />
        </Box>
        <Box sx={mainContentWrapper}>
          <Box sx={subContentColumnWrapper}>
            <Typography>
              {t("formulaire.form.create.title")} <span style={{ color: "var(--theme-palette-error-main)" }}>*</span> :
            </Typography>
            <TextField
              variant={ComponentVariant.STANDARD}
              sx={textFieldStyle}
              placeholder={t("formulaire.form.create.placeholder")}
              value={formPropInputValue[FormPropField.TITLE]}
              onChange={(e) => {
                handleFormPropInputValueChange(FormPropField.TITLE, e.target.value);
              }}
              slotProps={{
                htmlInput: { style: { width: "100%" } },
              }}
            />
          </Box>
          <Box sx={subContentRowWrapper}>
            <Typography>{t("formulaire.date.opening")}</Typography>
            <Box sx={datePickerWrapperStyle}>
              <DatePicker
                slotProps={{
                  textField: {
                    error: false,
                  },
                }}
                minDate={dayjs()}
                value={dayjs(formPropInputValue[FormPropField.DATE_OPENING])}
                onChange={(value) => {
                  handleDateChange(FormPropField.DATE_OPENING, value);
                }}
              />
            </Box>
            <Box
              sx={{
                ...dateEndingCheckboxStyle,
                cursor: "pointer",
              }}
              onClick={() => {
                setIsEndingDateEditable(!isEndingDateEditable);
              }}
            >
              <Checkbox
                sx={{ padding: "0" }}
                disabled={isPublic}
                checked={isEndingDateEditable}
                onChange={() => {
                  setIsEndingDateEditable(!isEndingDateEditable);
                }}
              />
              <Typography>{t("formulaire.date.ending")}</Typography>
            </Box>
            {isEndingDateEditable && (
              <Box sx={datePickerWrapperStyle}>
                <DatePicker
                  slotProps={{
                    textField: {
                      error: false,
                    },
                  }}
                  minDate={dayjs(dateOpening).add(1, "day")}
                  value={dayjs(formPropInputValue[FormPropField.DATE_ENDING])}
                  onChange={(value) => {
                    handleDateChange(FormPropField.DATE_ENDING, value);
                  }}
                />
              </Box>
            )}
          </Box>
          <Box sx={subContentColumnWrapper}>
            {formCheckBoxPropsReadyList.map((item) => {
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
                  <Box
                    key={item.field}
                    sx={{
                      ...checkboxRowStyle,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      if (!isDisabled) {
                        handleCheckboxChange(item.field);
                      }
                    }}
                  >
                    <Checkbox
                      sx={{ padding: "0" }}
                      disabled={isDisabled}
                      checked={isChecked}
                      onChange={(e) => {
                        e.stopPropagation();
                      }} // Prevent double firing of the event
                    />
                    <Typography>{t(item.i18nKey)}</Typography>
                    {!!item.tooltip && (
                      <Tooltip title={t(item.tooltip)}>
                        <InfoOutlinedIcon
                          color="secondary"
                          fontSize="small"
                          onClick={(e) => {
                            e.stopPropagation();
                          }} // Prevent checkbox toggling when clicking on the info icon
                        />
                      </Tooltip>
                    )}
                  </Box>
                  {showDescription && (
                    <Box>
                      <TextField
                        sx={{ maxWidth: "51rem !important" }}
                        variant={ComponentVariant.OUTLINED}
                        fullWidth
                        multiline
                        rows={4}
                        placeholder={t("formulaire.prop.description.placeholder")}
                        value={description}
                        onChange={(e) => {
                          handleFormPropInputValueChange(FormPropField.DESCRIPTION, e.target.value);
                        }}
                      />
                      <Typography color={GREY_DARK_COLOR} fontStyle="italic">
                        {t("formulaire.prop.description.description")}
                      </Typography>
                    </Box>
                  )}
                  {showRgpd && (
                    <Box sx={subContentColumnWrapper}>
                      <Box sx={rgpdContentRowStyle}>
                        <Typography>{t("formulaire.prop.rgpd.goal")}</Typography>
                        <TextField
                          variant={ComponentVariant.STANDARD}
                          sx={textFieldStyle}
                          placeholder={t("formulaire.prop.rgpd.goal.input")}
                          value={rgpdGoal}
                          onChange={(e) => {
                            handleFormPropInputValueChange(FormPropField.RGPD_GOAL, e.target.value);
                          }}
                          slotProps={{
                            htmlInput: { maxLength: 150, style: { width: "100%" } },
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
                            variant={ComponentVariant.STANDARD}
                            labelId="duration-select-label"
                            id="duration-select"
                            value={rgpdLifeTime}
                            onChange={(e) => {
                              handleFormPropInputValueChange(FormPropField.RGPD_LIFE_TIME, e.target.value);
                            }}
                            label={t("common.duration.label")}
                          >
                            {rgpdGoalDurationOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {`${option.toString()} ${t("formulaire.months")}`}
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
    </>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: formPropModalWrapper,
        },
      }}
    >
      <DialogTitle>
        <Box sx={spaceBetweenBoxStyle}>
          <Typography variant={TypographyVariant.H2} fontWeight={TypographyFont.BOLD}>
            {modalTitle}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>{formContent}</DialogContent>

      <DialogActions sx={modalActionsStyle}>
        <Button onClick={handleClose}>{t("formulaire.cancel")}</Button>
        <Button variant="contained" onClick={() => void handleSubmit()} disabled={!title.length}>
          {t("formulaire.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
