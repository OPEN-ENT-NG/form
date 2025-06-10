import { ChangeEvent, FC, useEffect, useState } from "react";
import { ICreationSectionProps } from "./types";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  Select,
  SelectChangeEvent,
  MenuItem,
  FormControl,
  Alert,
  TextField,
} from "@cgi-learning-hub/ui";
import {
  editingSectionTitleStyle,
  sectionAddQuestionStyle,
  sectionButtonIconStyle,
  sectionButtonStyle,
  sectionContentStyle,
  sectionDragIconStyle,
  sectionFooterStyle,
  sectionHeaderStyle,
  sectionStackStyle,
} from "./style";
import { IQuestion } from "~/core/models/question/types";
import { CreationQuestionWrapper } from "~/containers/CreationQuestionWrapper";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { dragIconContainerStyle, questionAlertStyle } from "~/containers/CreationQuestionWrapper/style";
import { AlertSeverityVariant, ComponentVariant } from "~/core/style/themeProps";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { isValidFormElement } from "~/core/models/formElement/utils";
import { useCreation } from "~/providers/CreationProvider";
import {
  getElementById,
  getElementPositionGreaterEqual,
  getFollowingFormElement,
  isCurrentEditingElement,
} from "~/providers/CreationProvider/utils";
import { useModal } from "~/providers/ModalProvider";
import { ModalType } from "~/core/enums";
import { CreateFormElementModal } from "~/containers/CreateFormElementModal";
import { IFormElement } from "~/core/models/formElement/types";
import { hasConditionalQuestion } from "~/core/models/section/utils";
import { hasFormResponses } from "~/core/models/form/utils";

export const CreationSection: FC<ICreationSectionProps> = ({ section }) => {
  const { t } = useTranslation(FORMULAIRE);
  const {
    form,
    formElementsList,
    setCurrentEditingElement,
    currentEditingElement,
    handleDuplicateFormElement,
    saveSection,
  } = useCreation();
  const {
    displayModals: { showQuestionCreate },
    toggleModal,
  } = useModal();

  const followingElement = getFollowingFormElement(section, formElementsList);
  const elementsTwoPositionsAheadList = section.position
    ? getElementPositionGreaterEqual(section.position + 2, formElementsList)
    : [];

  const [nextFormElementId, setNextFormElementId] = useState<number | undefined>(
    section.nextFormElementId ? section.nextFormElementId : undefined,
  );
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

  const handleDuplicate = () => {
    void handleDuplicateFormElement(section);
  };

  const handleEdit = () => {
    setCurrentEditingElement(section);
  };

  const handleAddNewQuestion = () => {
    toggleModal(ModalType.QUESTION_CREATE);
  };

  useEffect(() => {
    if (!nextFormElementId) return;
    //get nextElement from list of form elements
    const nextElement: IFormElement | undefined = getElementById(nextFormElementId, formElementsList);

    if (!nextElement?.formElementType) return;

    void saveSection({
      ...section,
      nextFormElementId: nextFormElementId ? nextFormElementId : null,
      nextFormElementType: nextElement.formElementType,
    });
  }, [nextFormElementId]);

  const handleNextFormElementChange = (event: SelectChangeEvent) => {
    const raw = event.target.value;
    setNextFormElementId(raw === "" ? undefined : Number(raw));
  };

  return (
    <Box>
      <Stack component={Paper} sx={sectionStackStyle}>
        <Box sx={sectionHeaderStyle}>
          <Box sx={dragIconContainerStyle}>
            <DragIndicatorRoundedIcon sx={sectionDragIconStyle} />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "100%", paddingX: "1rem" }}>
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
              <Box sx={{ width: "auto", display: "flex", alignItems: "center" }}>
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
            sx={{ marginTop: "2rem", marginBottom: "3rem" }}
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
            <Box sx={{ flex: 1 }} />
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              {!hasConditionalQuestion(section) && (
                <FormControl fullWidth>
                  <Select
                    variant={ComponentVariant.OUTLINED}
                    value={nextFormElementId != null ? String(nextFormElementId) : ""}
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

                    <MenuItem value="">{t("formulaire.access.recap")}</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
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
      {showQuestionCreate && (
        <CreateFormElementModal
          isOpen={showQuestionCreate}
          handleClose={() => {
            toggleModal(ModalType.QUESTION_CREATE);
          }}
          showSection={false}
          parentSection={section}
        />
      )}
    </Box>
  );
};
