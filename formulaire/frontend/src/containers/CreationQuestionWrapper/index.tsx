import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Alert,
  Box,
  ClickAwayListener,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ICreationQuestionWrapperProps } from "./types";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import { useCreation } from "~/providers/CreationProvider";
import { isValidFormElement } from "~/core/models/formElement/utils";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import {
  dragIconContainerStyle,
  dragIconStyle,
  editingQuestionContentStyle,
  editingQuestionFooterStyle,
  editingQuestionIconContainerStyle,
  editingQuestionIconStyle,
  editingQuestionStackStyle,
  editingQuestionTitleStyle,
  questionAlertStyle,
  questionStackStyle,
  questionTitleStyle,
} from "./style";
import { AlertSeverityVariant, ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { IQuestion } from "~/core/models/question/types";
import { useModal } from "~/providers/ModalProvider";
import { ModalType } from "~/core/enums";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { UndoConfirmationModal } from "../UndoConfirmationModal";
import { useClickAwayEditingElement } from "~/providers/CreationProvider/hook/useClickAwayEditingElement";

export const CreationQuestionWrapper: FC<ICreationQuestionWrapperProps> = ({ question }) => {
  const { t } = useTranslation(FORMULAIRE);
  const {
    currentEditingElement,
    setCurrentEditingElement,
    handleDuplicateFormElement,
    handleDeleteFormElement,
    saveQuestion,
  } = useCreation();
  const {
    displayModals: { showFormElementUndo, showFormElementDelete },
    toggleModal,
  } = useModal();
  const [currentQuestionTitle, setCurrentQuestionTitle] = useState<string>(question.title ?? "");

  useEffect(() => {
    if (!isCurrentEditingElement(question, currentEditingElement)) setCurrentQuestionTitle(question.title ?? "");
  }, [question.title]);

  const handleClickAwayEditingElement = useClickAwayEditingElement(
    currentEditingElement,
    handleDeleteFormElement,
    setCurrentEditingElement,
    saveQuestion,
  );

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestionTitle(event.target.value);
  };

  useEffect(() => {
    if (!currentEditingElement || !isCurrentEditingElement(question, currentEditingElement)) {
      return;
    }
    setCurrentEditingElement({
      ...question,
      title: currentQuestionTitle,
    });
  }, [currentQuestionTitle, setCurrentEditingElement]);

  const handleMandatoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedQuestion: IQuestion = {
      ...question,
      mandatory: event.target.checked,
    };
    setCurrentEditingElement(updatedQuestion);
  };

  const handleUndo = () => {
    toggleModal(ModalType.FORM_ELEMENT_UNDO);
  };

  const handleDelete = () => {
    toggleModal(ModalType.FORM_ELEMENT_DELETE);
  };

  const handleDuplicate = () => {
    void handleDuplicateFormElement(question);
  };

  const isEditing = isCurrentEditingElement(question, currentEditingElement);

  return (
    <Box>
      {isEditing ? (
        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onTouchStart"
          onClickAway={() => {
            void handleClickAwayEditingElement();
          }}
        >
          <Box>
            <Stack component={Paper} sx={editingQuestionStackStyle}>
              <Box>
                <TextField
                  variant={ComponentVariant.STANDARD}
                  fullWidth
                  sx={editingQuestionTitleStyle}
                  placeholder={t("formulaire.question.title.empty")}
                  value={currentQuestionTitle}
                  onChange={handleTitleChange}
                />
              </Box>

              <Box>
                <Typography variant={TypographyVariant.H6} sx={editingQuestionContentStyle}>
                  {/* TODO CONTENT */}
                  Content + {question.questionType}
                </Typography>
              </Box>

              <Box sx={editingQuestionFooterStyle}>
                <Switch checked={question.mandatory} onChange={handleMandatoryChange} />
                <Typography>{t("formulaire.mandatory")}</Typography>

                <Box sx={editingQuestionIconContainerStyle}>
                  <IconButton aria-label="duplicate" onClick={handleDuplicate}>
                    <FileCopyRoundedIcon sx={editingQuestionIconStyle} />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={handleDelete}>
                    <DeleteRoundedIcon sx={editingQuestionIconStyle} />
                  </IconButton>
                  <IconButton aria-label="undo" onClick={handleUndo}>
                    <UndoRoundedIcon sx={editingQuestionIconStyle} />
                  </IconButton>
                </Box>
              </Box>
            </Stack>
            {showFormElementDelete && (
              <DeleteConfirmationModal
                isOpen={showFormElementDelete}
                handleClose={() => {
                  toggleModal(ModalType.FORM_ELEMENT_DELETE);
                }}
                question={question}
              />
            )}
            {showFormElementUndo && (
              <UndoConfirmationModal
                isOpen={showFormElementUndo}
                handleClose={() => {
                  toggleModal(ModalType.FORM_ELEMENT_UNDO);
                }}
                question={question}
              />
            )}
          </Box>
        </ClickAwayListener>
      ) : (
        <Stack
          component={Paper}
          sx={questionStackStyle}
          onClick={() => {
            setCurrentEditingElement(question);
          }}
        >
          <Box sx={dragIconContainerStyle}>
            <DragIndicatorRoundedIcon sx={dragIconStyle} />
          </Box>
          <Box sx={questionTitleStyle}>
            <Typography variant={TypographyVariant.H6}>{question.title}</Typography>
          </Box>
          <Box>
            <Typography>Content + {question.questionType}</Typography>
          </Box>
        </Stack>
      )}

      {!isValidFormElement(question) && (
        <Alert
          severity={AlertSeverityVariant.WARNING}
          title={t("formulaire.question.missing.field")}
          children={t("formulaire.question.missing.field.title")}
          sx={questionAlertStyle}
        />
      )}
    </Box>
  );
};
