import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
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
  conditionalSwitchContainerStyle,
  dragIconContainerStyle,
  dragIconStyle,
  editingQuestionContentStyle,
  editingQuestionFooterStyle,
  editingQuestionIconContainerStyle,
  editingQuestionIconStyle,
  editingQuestionTitleStyle,
  questionAlertStyle,
  questionStackStyle,
  questionTitleStyle,
  StyledPaper,
} from "./style";
import { AlertSeverityVariant, ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { IQuestion } from "~/core/models/question/types";
import { useModal } from "~/providers/ModalProvider";
import { ModalType } from "~/core/enums";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { UndoConfirmationModal } from "../UndoConfirmationModal";
import { useClickAwayEditingElement } from "~/providers/CreationProvider/hook/useClickAwayEditingElement";
import { isCursorChoiceConsistent, shouldShowConditionalSwitch } from "~/core/models/question/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { getQuestionContentByType } from "./utils";

export const CreationQuestionWrapper: FC<ICreationQuestionWrapperProps> = ({ question }) => {
  const { t } = useTranslation(FORMULAIRE);
  const {
    formElementsList,
    currentEditingElement,
    setCurrentEditingElement,
    handleDuplicateFormElement,
    handleDeleteFormElement,
    saveQuestion,
  } = useCreation();
  const {
    displayModals: { showQuestionUndo, showQuestionDelete },
    toggleModal,
  } = useModal();
  const [currentQuestionTitle, setCurrentQuestionTitle] = useState<string>(question.title ?? "");
  const isEditing = isCurrentEditingElement(question, currentEditingElement);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isCurrentEditingElement(question, currentEditingElement)) setCurrentQuestionTitle(question.title ?? "");
  }, [question.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

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

  const handleConditionalChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedQuestion: IQuestion = {
      ...question,
      conditional: event.target.checked,
      mandatory: event.target.checked,
    };
    setCurrentEditingElement(updatedQuestion);
  };

  const handleUndo = () => {
    toggleModal(ModalType.QUESTION_UNDO);
  };

  const handleDelete = () => {
    toggleModal(ModalType.QUESTION_DELETE);
  };

  const handleDuplicate = () => {
    void handleDuplicateFormElement(question);
  };

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
            <StyledPaper isValidFormElement={isValidFormElement(question)}>
              <Box>
                <TextField
                  inputRef={inputRef}
                  variant={ComponentVariant.STANDARD}
                  fullWidth
                  sx={editingQuestionTitleStyle}
                  placeholder={t("formulaire.question.title.empty")}
                  value={currentQuestionTitle}
                  onChange={handleTitleChange}
                />
              </Box>

              <Box sx={editingQuestionContentStyle}>{getQuestionContentByType(question)}</Box>

              <Box sx={editingQuestionFooterStyle}>
                <Switch checked={question.mandatory} onChange={handleMandatoryChange} />

                <Typography>{t("formulaire.mandatory")}</Typography>
                {shouldShowConditionalSwitch(question, formElementsList) && (
                  <Box sx={conditionalSwitchContainerStyle}>
                    <Switch checked={question.conditional} onChange={handleConditionalChange} />
                    <Typography>{t("formulaire.conditional")}</Typography>
                  </Box>
                )}

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
            </StyledPaper>
            {showQuestionDelete && (
              <DeleteConfirmationModal
                isOpen={showQuestionDelete}
                handleClose={() => {
                  toggleModal(ModalType.QUESTION_DELETE);
                }}
                element={question}
              />
            )}
            {showQuestionUndo && (
              <UndoConfirmationModal
                isOpen={showQuestionUndo}
                handleClose={() => {
                  toggleModal(ModalType.QUESTION_UNDO);
                }}
                element={question}
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
          <Box>{getQuestionContentByType(question)}</Box>
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
      {question.questionType === QuestionTypes.CURSOR && !isCursorChoiceConsistent(question) && (
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
