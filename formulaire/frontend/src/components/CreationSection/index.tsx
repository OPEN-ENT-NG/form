import { ChangeEvent, FC, useEffect, useState } from "react";
import { ICreationSectionProps } from "./types";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Alert,
  TextField,
} from "@cgi-learning-hub/ui";
import {
  descriptionStyle,
  editingSectionTitleStyle,
  nextElementSelectorStyle,
  sectionAddQuestionStyle,
  sectionButtonIconStyle,
  sectionButtonStyle,
  sectionContentStyle,
  sectionDragIconStyle,
  sectionFooterStyle,
  sectionHeaderStyle,
  sectionHeaderWrapperStyle,
  sectionIconWrapperStyle,
  sectionNewQuestionStyle,
  sectionStackStyle,
  sectionTitleStyle,
} from "./style";
import { IQuestion } from "~/core/models/question/types";
import { CreationQuestionWrapper } from "~/containers/CreationQuestionWrapper";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { dragIconContainerStyle, questionAlertStyle } from "~/containers/CreationQuestionWrapper/style";
import { AlertSeverityVariant, ComponentVariant } from "~/core/style/themeProps";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, TARGET_RECAP } from "~/core/constants";
import { isValidFormElement } from "~/core/models/formElement/utils";
import { useCreation } from "~/providers/CreationProvider";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useModal } from "~/providers/ModalProvider";
import { ModalType } from "~/core/enums";
import { hasConditionalQuestion } from "~/core/models/section/utils";
import { hasFormResponses } from "~/core/models/form/utils";
import { useTargetNextElement } from "~/hook/useTargetNextElement";

export const CreationSection: FC<ICreationSectionProps> = ({ section }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { form, setCurrentEditingElement, currentEditingElement, handleDuplicateFormElement, setQuestionModalSection } = useCreation();
  const { toggleModal } = useModal();

  const {
    targetNextElementId,
    followingElement,
    elementsTwoPositionsAheadList,
    onChange: handleNextFormElementChange,
  } = useTargetNextElement(section);

  //TITLE
  const [currentSectionTitle, setCurrentSectionTitle] = useState<string>(section.title ?? "");
  const isEditing = isCurrentEditingElement(section, currentEditingElement);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSectionTitle(event.target.value);
  };

  useEffect(() => {
    if (!isCurrentEditingElement(section, currentEditingElement)) setCurrentSectionTitle(section.title ?? "");
  }, [section.title]);

  useEffect(() => {
    if (!currentEditingElement || !isCurrentEditingElement(section, currentEditingElement)) {
      return;
    }
    setCurrentEditingElement({
      ...section,
      title: currentSectionTitle,
    });
  }, [currentSectionTitle, setCurrentEditingElement]);

  //ACTIONS
  const handleDuplicate = () => {
    void handleDuplicateFormElement(section);
  };

  const handleEdit = () => {
    setCurrentEditingElement(section);
  };

  const handleAddNewQuestion = () => {
    setQuestionModalSection(section);
    toggleModal(ModalType.QUESTION_CREATE);
  };

  return (
    <Box>
      <Stack component={Paper} sx={sectionStackStyle}>
        <Box sx={sectionHeaderWrapperStyle}>
          <Box sx={dragIconContainerStyle}>
            <DragIndicatorRoundedIcon sx={sectionDragIconStyle} />
          </Box>
          <Box sx={sectionHeaderStyle}>
            <Box sx={sectionTitleStyle}>
              {isEditing ? (
                <TextField
                  variant={ComponentVariant.STANDARD}
                  fullWidth
                  sx={editingSectionTitleStyle}
                  placeholder={t("formulaire.section.title.empty")}
                  value={currentSectionTitle}
                  onChange={handleTitleChange}
                />
              ) : (
                <Typography>{section.title ? section.title : t("formulaire.section.title.empty")}</Typography>
              )}
            </Box>
            {currentEditingElement === null && (
              <Box sx={sectionIconWrapperStyle}>
                <IconButton
                  aria-label="duplicate"
                  onClick={handleDuplicate}
                  disabled={!!form && hasFormResponses(form)}
                  sx={sectionButtonStyle}
                >
                  <FileCopyRoundedIcon sx={sectionButtonIconStyle} />
                </IconButton>
                <IconButton aria-label="edit" onClick={handleEdit} sx={sectionButtonStyle}>
                  <EditRoundedIcon sx={sectionButtonIconStyle} />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={sectionContentStyle}>
          <Typography
            sx={descriptionStyle}
            dangerouslySetInnerHTML={{
              __html: section.description || t("formulaire.section.no.description"),
            }}
          />
          <Box>
            {section.questions.map((question: IQuestion) => (
              <CreationQuestionWrapper key={question.id} question={question} />
            ))}
          </Box>
          <Box sx={sectionFooterStyle}>
            <Box sx={nextElementSelectorStyle}>
              {!hasConditionalQuestion(section) && (
                <FormControl fullWidth>
                  <Select
                    variant={ComponentVariant.OUTLINED}
                    value={targetNextElementId != null ? String(targetNextElementId) : TARGET_RECAP}
                    onChange={handleNextFormElementChange}
                    displayEmpty
                  >
                    {followingElement && (
                      <MenuItem value={followingElement.id != null ? String(followingElement.id) : ""}>
                        {t("formulaire.access.next")}
                      </MenuItem>
                    )}

                    {elementsTwoPositionsAheadList.map((el) => (
                      <MenuItem key={el.id} value={el.id != null ? String(el.id) : ""}>
                        {t("formulaire.access.element") + (el.title ?? "")}
                      </MenuItem>
                    ))}

                    <MenuItem value={TARGET_RECAP}>{t("formulaire.access.recap")}</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
            <Box sx={sectionNewQuestionStyle}>
              {!!form && !hasFormResponses(form) && (
                <Typography sx={sectionAddQuestionStyle} onClick={handleAddNewQuestion}>
                  {t("formulaire.section.new.question")}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Stack>
      {!isValidFormElement(section) && (
        <Alert
          severity={AlertSeverityVariant.WARNING}
          title={t("formulaire.section.missing.field")}
          children={t("formulaire.section.missing.field.title")}
          sx={questionAlertStyle}
        />
      )}
    </Box>
  );
};
