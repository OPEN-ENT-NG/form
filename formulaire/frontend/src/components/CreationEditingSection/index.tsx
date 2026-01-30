import { Alert, Box, Button, Stack, TextField, Typography } from "@cgi-learning-hub/ui";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import {
  editorContainerStyle,
  sectionContentStyle,
  sectionFooterStyle,
  sectionHeaderStyle,
  sectionHeaderWrapperStyle,
  sectionIconWrapperStyle,
  sectionTitleStyle,
} from "./style";
import { ICreationEditingSectionProps } from "./types";

import { Editor, EditorRef } from "@edifice.io/react/editor";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import { useTranslation } from "react-i18next";
import { questionAlertStyle } from "~/containers/CreationQuestionWrapper/style";
import { DeleteConfirmationModal } from "~/containers/DeleteConfirmationModal";
import { UndoConfirmationModal } from "~/containers/UndoConfirmationModal";
import { EDITOR_CONTENT_HTML, FORMULAIRE } from "~/core/constants";
import { ModalType } from "~/core/enums";
import { hasFormResponses } from "~/core/models/form/utils";
import { isSection, isValidFormElement } from "~/core/models/formElement/utils";
import { ISection } from "~/core/models/section/types";
import { AlertSeverityVariant, ComponentVariant } from "~/core/style/themeProps";
import { isEnterPressed } from "~/core/utils";
import { useCreation } from "~/providers/CreationProvider";
import { useClickAwayEditingElement } from "~/providers/CreationProvider/hook/useClickAwayEditingElement";
import { isCurrentEditingElement, preventPropagation } from "~/providers/CreationProvider/utils";
import { useGlobal } from "~/providers/GlobalProvider";
import { useCreateSectionMutation } from "~/services/api/services/formulaireApi/sectionApi";
import { EditorMode } from "../CreationQuestionTypes/CreationQuestionFreetext/enums";
import {
  editingSectionTitleStyle,
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
    newChoiceValue,
    setNewChoiceValue,
  } = useCreation();
  const [currentSectionTitle, setCurrentSectionTitle] = useState<string>(section.title ?? "");
  const editorRef = useRef<EditorRef>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const initialSectionDescription = useRef(section.description);
  const [createSection] = useCreateSectionMutation();

  const { saveFormElement } = useClickAwayEditingElement(
    handleDeleteFormElement,
    setCurrentEditingElement,
    formElementsList,
    setFormElementsList,
    newChoiceValue,
    setNewChoiceValue,
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

  useEffect(() => {
    requestAnimationFrame(() => {
      titleInputRef.current?.focus();
    });
  }, []);

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
    if (currentEditingElement?.isNew) {
      void createSection(updated).unwrap();
    } else {
      void saveFormElement(updated, formElementsList);
    }
    setCurrentEditingElement(null);
  };

  return (
    <Box>
      <Box>
        <Stack sx={sectionStackStyle}>
          <Box sx={sectionHeaderWrapperStyle}>
            <Box sx={sectionHeaderStyle}>
              <Box sx={sectionTitleStyle}>
                <TextField
                  inputRef={titleInputRef}
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
                focus={false}
              />
            </Box>
            {!!form && !hasFormResponses(form) && (
              <Box sx={sectionFooterStyle}>
                <Button
                  onClick={(e) => {
                    preventPropagation(e);
                    if (currentEditingElement) updateAndSaveSection();
                    void handleAddNewQuestion();
                  }}
                  variant="text"
                >
                  <Typography color="secondary">{t("formulaire.section.new.question")}</Typography>
                </Button>
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
