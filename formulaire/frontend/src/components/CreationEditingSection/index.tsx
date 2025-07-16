import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { ICreationEditingSectionProps } from "./types";
import { Box, Typography, IconButton, Stack, Paper, Alert, TextField, ClickAwayListener } from "@cgi-learning-hub/ui";
import {
  editingSectionTitleStyle,
  editorContainerStyle,
  newQuestionWrapperStyle,
  sectionAddQuestionStyle,
  sectionButtonIconStyle,
  sectionButtonStyle,
  sectionContentStyle,
  sectionFooterStyle,
  sectionHeaderStyle,
  sectionHeaderWrapperStyle,
  sectionIconWrapperStyle,
  sectionStackStyle,
  sectionTitleStyle,
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
import { hasFormResponses } from "~/core/models/form/utils";
import { isEnterPressed } from "~/core/utils";
import { useCreateSectionMutation } from "~/services/api/services/formulaireApi/sectionApi";
import { isFormElementSection } from "~/core/models/section/utils";

export const CreationEditingSection: FC<ICreationEditingSectionProps> = ({ section }) => {
  const { t } = useTranslation(FORMULAIRE);
  const {
    form,
    setCurrentEditingElement,
    currentEditingElement,
    handleDeleteFormElement,
    saveSection,
    setQuestionModalSection,
  } = useCreation();
  const [currentSectionTitle, setCurrentSectionTitle] = useState<string>(section.title ?? "");
  const editorRef = useRef<EditorRef>(null);
  const [createSection] = useCreateSectionMutation();

  const handleClickAwayEditingElement = useClickAwayEditingElement(
    handleDeleteFormElement,
    setCurrentEditingElement,
    undefined,
    saveSection,
  );
  const {
    displayModals: { showSectionDelete, showSectionUndo },
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

  const handleDelete = () => {
    toggleModal(ModalType.SECTION_DELETE);
  };

  const handleUndo = () => {
    toggleModal(ModalType.SECTION_UNDO);
  };

  const handleAddNewQuestion = async () => {
    const targetSection = await getOrCreateTargetSection();
    setQuestionModalSection(targetSection);
    toggleModal(ModalType.QUESTION_CREATE);
  };

  const getOrCreateTargetSection = async (): Promise<ISection> => {
    if (currentEditingElement && isFormElementSection(currentEditingElement) && currentEditingElement.isNew) {
      const sectionToCreate: ISection = {
        ...currentEditingElement,
        title: t("formulaire.section.title.default"),
      } as ISection;
      return await createSection(sectionToCreate).unwrap();
    }
    return section;
  };

  return (
    <Box>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={() => {
          const updated = {
            ...currentEditingElement,
            description: editorRef.current?.getContent("html") as string,
          } as ISection;
          setCurrentEditingElement(updated);
          void handleClickAwayEditingElement(updated);
        }}
      >
        <Box>
          <Stack component={Paper} sx={sectionStackStyle}>
            <Box sx={sectionHeaderWrapperStyle}>
              <Box sx={sectionHeaderStyle}>
                <Box sx={sectionTitleStyle}>
                  <TextField
                    variant={ComponentVariant.STANDARD}
                    fullWidth
                    sx={editingSectionTitleStyle}
                    placeholder={t("formulaire.section.title.empty")}
                    value={currentSectionTitle}
                    onChange={handleTitleChange}
                    onKeyDown={(e) => {
                      if (isEnterPressed(e) && currentEditingElement) {
                        const updated = {
                          ...currentEditingElement,
                          description: editorRef.current?.getContent("html") as string,
                        } as ISection;
                        setCurrentEditingElement(updated);
                        void handleClickAwayEditingElement(updated);
                      }
                    }}
                  />
                </Box>
                <Box sx={sectionIconWrapperStyle}>
                  <IconButton
                    aria-label="delete"
                    onClick={handleDelete}
                    disabled={!!form && hasFormResponses(form)}
                    sx={sectionButtonStyle}
                  >
                    <DeleteRoundedIcon sx={sectionButtonIconStyle} />
                  </IconButton>
                  <IconButton aria-label="undo" onClick={handleUndo} sx={sectionButtonStyle}>
                    <UndoRoundedIcon sx={sectionButtonIconStyle} />
                  </IconButton>
                  <IconButton
                    aria-label="save"
                    onClick={() => {
                      if (currentEditingElement) {
                        const updated = {
                          ...currentEditingElement,
                          description: editorRef.current?.getContent("html") as string,
                        } as ISection;
                        setCurrentEditingElement(updated);
                        void handleClickAwayEditingElement(updated);
                      }
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
                <Editor id="postContent" content={section.description} mode="edit" ref={editorRef} />
              </Box>
              {!!form && !hasFormResponses(form) && (
                <Box sx={sectionFooterStyle} onClick={() => void handleAddNewQuestion()}>
                  <Box sx={newQuestionWrapperStyle}>
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
