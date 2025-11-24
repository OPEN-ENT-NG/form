import { FC, useCallback, useEffect, useState } from "react";
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
  EllipsisWithTooltip,
  Tooltip,
} from "@cgi-learning-hub/ui";
import {
  descriptionStyle,
  nextElementSelectorStyle,
  nextElementSelectorWrapperStyle,
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
import { useGlobal } from "~/providers/GlobalProvider";
import { EditorMode, EditorVariant, ModalType } from "~/core/enums";
import { hasConditionalQuestion } from "~/core/models/section/utils";
import { hasFormResponses } from "~/core/models/form/utils";
import { useTargetNextElement } from "~/hook/targetNextElement/useTargetNextElement";
import { ISection } from "~/core/models/section/types";
import { FormElementType } from "~/core/models/formElement/enum";
import { StyledEditorWrapper } from "../CreationQuestionTypes/CreationQuestionFreetext/style";
import { Editor } from "@edifice.io/react/editor";

export const CreationSection: FC<ICreationSectionProps> = ({ section }) => {
  const { t } = useTranslation(FORMULAIRE);
  const {
    form,
    setCurrentEditingElement,
    currentEditingElement,
    handleDuplicateFormElement,
    setQuestionModalSection,
    saveSection,
  } = useCreation();
  const { toggleModal } = useGlobal();

  const onSaveSectionNextElement = useCallback(
    (updatedEntity: ISection, targetElementId: number | undefined, targetElementType: FormElementType | undefined) => {
      void saveSection({
        ...updatedEntity,
        nextFormElementId: targetElementId ?? null,
        nextFormElementType: targetElementType ?? null,
      });
    },
    [saveSection],
  );

  const {
    targetNextElementId,
    followingElement,
    elementsTwoPositionsAheadList,
    onChange: handleNextFormElementChange,
  } = useTargetNextElement({ entity: section, positionReferenceElement: section, onSave: onSaveSectionNextElement });

  //TITLE
  const [currentSectionTitle, setCurrentSectionTitle] = useState<string>(section.title ?? "");

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
              <EllipsisWithTooltip>
                {section.title ? section.title : t("formulaire.section.title.empty")}
              </EllipsisWithTooltip>
            </Box>
            {currentEditingElement === null && (
              <Box sx={sectionIconWrapperStyle}>
                <Tooltip title={t("formulaire.duplicate")} placement="top" disableInteractive>
                  <IconButton
                    aria-label="duplicate"
                    onClick={handleDuplicate}
                    disabled={!!form && hasFormResponses(form)}
                    sx={sectionButtonStyle}
                  >
                    <FileCopyRoundedIcon sx={sectionButtonIconStyle} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("formulaire.edit")} placement="top" disableInteractive>
                  <IconButton aria-label="edit" onClick={handleEdit} sx={sectionButtonStyle}>
                    <EditRoundedIcon sx={sectionButtonIconStyle} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={sectionContentStyle}>
          <Box sx={descriptionStyle}>
            <StyledEditorWrapper isCurrentEditingElement={false}>
              <Editor
                content={section.description || t("formulaire.section.no.description")}
                mode={EditorMode.READ}
                variant={EditorVariant.GHOST}
              />
            </StyledEditorWrapper>
          </Box>
          <Box>
            {section.questions.map((question: IQuestion) => (
              <CreationQuestionWrapper key={question.id} question={question} />
            ))}
          </Box>
          <Box sx={sectionFooterStyle}>
            <Box sx={nextElementSelectorWrapperStyle}>
              {!hasConditionalQuestion(section) && (
                <FormControl fullWidth>
                  <Select
                    variant={ComponentVariant.OUTLINED}
                    value={targetNextElementId != null ? String(targetNextElementId) : TARGET_RECAP}
                    onChange={handleNextFormElementChange}
                    displayEmpty
                    MenuProps={{
                      PaperProps: {
                        sx: nextElementSelectorStyle,
                      },
                    }}
                  >
                    {followingElement && (
                      <MenuItem value={followingElement.id != null ? String(followingElement.id) : ""}>
                        <EllipsisWithTooltip>{t("formulaire.access.next")}</EllipsisWithTooltip>
                      </MenuItem>
                    )}

                    {elementsTwoPositionsAheadList.map((el) => (
                      <MenuItem key={el.id} value={el.id != null ? String(el.id) : ""}>
                        <EllipsisWithTooltip> {t("formulaire.access.element") + (el.title ?? "")}</EllipsisWithTooltip>
                      </MenuItem>
                    ))}

                    <MenuItem value={TARGET_RECAP}>
                      <EllipsisWithTooltip> {t("formulaire.access.recap")}</EllipsisWithTooltip>
                    </MenuItem>
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
