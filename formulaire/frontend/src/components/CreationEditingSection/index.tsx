import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { ICreationEditingSectionProps } from "./types";
import { Box, Typography, IconButton, Stack, Paper, Alert, TextField, ClickAwayListener } from "@cgi-learning-hub/ui";
import {
  editingSectionTitleStyle,
  editorContainerStyle,
  sectionAddQuestionStyle,
  sectionButtonIconStyle,
  sectionButtonStyle,
  sectionContentStyle,
  sectionFooterStyle,
  sectionHeaderStyle,
  sectionStackStyle,
} from "./style";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { AlertSeverityVariant, ComponentVariant } from "~/core/style/themeProps";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { isValidFormElement } from "~/core/models/formElement/utils";
import { useCreation } from "~/providers/CreationProvider";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useClickAwayEditingElement } from "~/providers/CreationProvider/hook/useClickAwayEditingElement";
import { Editor, EditorRef } from "@edifice.io/react/editor";
import { ISection } from "~/core/models/section/types";
import { ModalType } from "~/core/enums";
import { DeleteConfirmationModal } from "~/containers/DeleteConfirmationModal";
import { useModal } from "~/providers/ModalProvider";
import { questionAlertStyle } from "~/containers/CreationQuestionWrapper/style";
import { UndoConfirmationModal } from "~/containers/UndoConfirmationModal";
import { CreateFormElementModal } from "~/containers/CreateFormElementModal";
import { hasFormResponses } from "~/core/models/form/utils";
import { isEnterPressed } from "~/core/utils";

export const CreationEditingSection: FC<ICreationEditingSectionProps> = ({ section }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { form, setCurrentEditingElement, currentEditingElement, handleDeleteFormElement, saveSection } = useCreation();
  const [currentSectionTitle, setCurrentSectionTitle] = useState<string>(section.title ?? "");
  const [description, setDescription] = useState<string>(section.description ?? "");
  const editorRef = useRef<EditorRef>(null);
  const handleClickAwayEditingElement = useClickAwayEditingElement(
    currentEditingElement,
    handleDeleteFormElement,
    setCurrentEditingElement,
    undefined,
    saveSection,
  );
  const {
    displayModals: { showSectionDelete, showSectionUndo, showQuestionCreate },
    toggleModal,
  } = useModal();

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

  useEffect(() => {
    if (!currentEditingElement || !isCurrentEditingElement(section, currentEditingElement)) {
      return;
    }

    const newSection: ISection = {
      ...section,
      description: description,
    };
    setCurrentEditingElement(newSection);
  }, [description, setDescription]);

  const handleDelete = () => {
    // Logic to duplicate the section
    toggleModal(ModalType.SECTION_DELETE);
  };

  const handleUndo = () => {
    toggleModal(ModalType.SECTION_UNDO);
  };

  const handleAddNewQuestion = () => {
    toggleModal(ModalType.QUESTION_CREATE);
  };

  return (
    <Box>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={() => {
          void handleClickAwayEditingElement();
        }}
      >
        <Box>
          <Stack component={Paper} sx={sectionStackStyle}>
            <Box sx={sectionHeaderStyle}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                  paddingTop: "3rem",
                }}
              >
                <Box sx={{ width: "100%", paddingX: "1rem" }}>
                  <TextField
                    variant={ComponentVariant.STANDARD}
                    fullWidth
                    sx={editingSectionTitleStyle}
                    placeholder={t("formulaire.section.title.empty")}
                    value={currentSectionTitle}
                    onChange={handleTitleChange}
                    onKeyDown={(e) => {
                      if (isEnterPressed(e)) void handleClickAwayEditingElement();
                    }}
                  />
                </Box>
                <Box sx={{ width: "auto", display: "flex", alignItems: "center" }}>
                  <IconButton
                    aria-label="delete"
                    onClick={handleDelete}
                    disabled={!!form && hasFormResponses(form)}
                    sx={sectionButtonStyle}
                  >
                    <DeleteRoundedIcon sx={sectionButtonIconStyle} />
                  </IconButton>
                  <IconButton aria-label="edit" onClick={handleUndo} sx={sectionButtonStyle}>
                    <UndoRoundedIcon sx={sectionButtonIconStyle} />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      void handleClickAwayEditingElement();
                    }}
                    sx={sectionButtonStyle}
                  >
                    <CheckCircleRoundedIcon sx={sectionButtonIconStyle} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Box sx={sectionContentStyle}>
              <Box sx={editorContainerStyle}>
                <Editor
                  id="postContent"
                  content={description}
                  mode="edit"
                  ref={editorRef}
                  onContentChange={() => {
                    setDescription(editorRef.current?.getContent("html") as string);
                  }}
                />
              </Box>
              {!!form && !hasFormResponses(form) && (
                <Box sx={sectionFooterStyle} onClick={handleAddNewQuestion}>
                  <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                    <Typography sx={sectionAddQuestionStyle}>{t("formulaire.section.new.question")}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Stack>
          {showSectionDelete && (
            <DeleteConfirmationModal
              isOpen={showSectionDelete}
              handleClose={() => {
                toggleModal(ModalType.SECTION_DELETE);
              }}
              element={section}
            />
          )}
          {showSectionUndo && (
            <UndoConfirmationModal
              isOpen={showSectionUndo}
              handleClose={() => {
                toggleModal(ModalType.SECTION_UNDO);
              }}
              element={section}
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
      </ClickAwayListener>
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
