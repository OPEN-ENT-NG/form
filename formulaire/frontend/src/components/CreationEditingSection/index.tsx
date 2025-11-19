import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { ICreationEditingSectionProps } from "./types";
import { Box, Typography, Stack, Paper, Alert, TextField } from "@cgi-learning-hub/ui";
import {
  editorContainerStyle,
  newQuestionWrapperStyle,
  sectionContentStyle,
  sectionFooterStyle,
  sectionHeaderStyle,
  sectionHeaderWrapperStyle,
  sectionIconWrapperStyle,
  sectionTitleStyle,
} from "./style";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { AlertSeverityVariant, ComponentVariant } from "~/core/style/themeProps";
import { useTranslation } from "react-i18next";
import { EDITOR_CONTENT_HTML, FORMULAIRE } from "~/core/constants";
import { isSection, isValidFormElement } from "~/core/models/formElement/utils";
import { useCreation } from "~/providers/CreationProvider";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useClickAwayEditingElement } from "~/providers/CreationProvider/hook/useClickAwayEditingElement";
import { Editor, EditorRef } from "@edifice.io/react/editor";
import { ISection } from "~/core/models/section/types";
import { EditorMode, ModalType } from "~/core/enums";
import { DeleteConfirmationModal } from "~/containers/DeleteConfirmationModal";
import { useGlobal } from "~/providers/GlobalProvider";
import { questionAlertStyle } from "~/containers/CreationQuestionWrapper/style";
import { UndoConfirmationModal } from "~/containers/UndoConfirmationModal";
import { hasFormResponses } from "~/core/models/form/utils";
import { isEnterPressed } from "~/core/utils";
import { useCreateSectionMutation } from "~/services/api/services/formulaireApi/sectionApi";
import {
  editingSectionTitleStyle,
  sectionAddQuestionStyle,
  sectionButtonIconStyle,
  sectionButtonStyle,
  sectionStackStyle,
} from "../CreationSection/style";
import { IconButtonTooltiped } from "../IconButtonTooltiped/IconButtonTooltiped";

export const CreationEditingSection: FC<ICreationEditingSectionProps> = ({ section }) => {
  const { t } = useTranslation(FORMULAIRE);
  const {
    form,
    formElementsList,
    setCurrentEditingElement,
    currentEditingElement,
    handleDeleteFormElement,
    saveSection,
    setQuestionModalSection,
    setFormElementsList,
  } = useCreation();
  const [currentSectionTitle, setCurrentSectionTitle] = useState<string>(section.title ?? "");
  const editorRef = useRef<EditorRef>(null);
  const initialSectionDescription = useRef(section.description);
  const [createSection] = useCreateSectionMutation();

  const { saveFormElement } = useClickAwayEditingElement(
    handleDeleteFormElement,
    setCurrentEditingElement,
    formElementsList,
    setFormElementsList,
    undefined,
    saveSection,
  );
  const {
    displayModals: { showSectionDelete, showSectionUndo },
    toggleModal,
    selectAllTextInput,
  } = useGlobal();

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
    if (currentEditingElement && isSection(currentEditingElement) && currentEditingElement.isNew) {
      const sectionToCreate: ISection = {
        ...currentEditingElement,
        title: t("formulaire.section.title.default"),
      } as ISection;
      return await createSection(sectionToCreate).unwrap();
    }
    return section;
  };

  const updateSection = () => {
    const updated = {
      ...currentEditingElement,
      description: editorRef.current?.getContent(EDITOR_CONTENT_HTML) as string,
    } as ISection;
    setCurrentEditingElement(updated);
    return updated;
  };

  const updateAndSaveSection = () => {
    const updated = updateSection();
    void saveFormElement(updated, formElementsList);
    setCurrentEditingElement(null);
  };

  return (
    <Box>
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
                  onFocus={selectAllTextInput}
                  onKeyDown={(e) => {
                    if (isEnterPressed(e) && currentEditingElement) updateAndSaveSection();
                  }}
                />
              </Box>
              <Box sx={sectionIconWrapperStyle}>
                <IconButtonTooltiped
                  icon={<DeleteRoundedIcon sx={sectionButtonIconStyle} />}
                  onClick={handleDelete}
                  tooltipI18nKey={"formulaire.delete"}
                  ariaLabel="delete"
                  disabled={!!form && hasFormResponses(form)}
                  slotProps={{ iconButton: sectionButtonStyle }}
                />
                <IconButtonTooltiped
                  icon={<UndoRoundedIcon sx={sectionButtonIconStyle} />}
                  onClick={handleUndo}
                  tooltipI18nKey={"formulaire.cancel"}
                  ariaLabel="undo"
                  slotProps={{ iconButton: sectionButtonStyle }}
                />
                <IconButtonTooltiped
                  icon={<CheckCircleRoundedIcon sx={sectionButtonIconStyle} />}
                  onClick={() => {
                    if (currentEditingElement) updateAndSaveSection();
                  }}
                  tooltipI18nKey={"formulaire.validate"}
                  ariaLabel="save"
                  slotProps={{ iconButton: sectionButtonStyle }}
                />
              </Box>
            </Box>
          </Box>
          <Box sx={sectionContentStyle}>
            <Box sx={editorContainerStyle}>
              <Editor
                id="postContent"
                content={initialSectionDescription.current}
                mode={EditorMode.EDIT}
                ref={editorRef}
                onContentChange={updateSection}
              />
            </Box>
            {!!form && !hasFormResponses(form) && (
              <Box
                sx={sectionFooterStyle}
                onClick={() => {
                  if (currentEditingElement) updateAndSaveSection();
                  void handleAddNewQuestion();
                }}
              >
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
