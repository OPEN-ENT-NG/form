import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  ClickAwayListener,
  EllipsisWithTooltip,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, MOUSE_EVENT_DOWN, TOUCH_EVENT_START } from "~/core/constants";
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
  mandatorySwitchContainerStyle,
  mandatoryTitleStyle,
  questionAlertStyle,
  questionStackStyle,
  questionTitleStyle,
  StyledPaper,
} from "./style";
import { AlertSeverityVariant, BoxComponentType, ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { IQuestion } from "~/core/models/question/types";
import { useModal } from "~/providers/ModalProvider";
import { ModalType } from "~/core/enums";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { UndoConfirmationModal } from "../UndoConfirmationModal";
import { useClickAwayEditingElement } from "~/providers/CreationProvider/hook/useClickAwayEditingElement";
import {
  isCursorChoiceConsistent,
  shouldShowConditionalSwitch,
  shouldShowMandatorySwitch,
} from "~/core/models/question/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { getQuestionContentByType } from "./utils";
import { ERROR_MAIN_COLOR, TEXT_SECONDARY_COLOR } from "~/core/style/colors";

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

    setCurrentEditingElement((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        title: currentQuestionTitle,
      };
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
          mouseEvent={MOUSE_EVENT_DOWN}
          touchEvent={TOUCH_EVENT_START}
          onClickAway={() => {
            if (!currentEditingElement || !isCurrentEditingElement(question, currentEditingElement)) {
              return;
            }
            void handleClickAwayEditingElement(currentEditingElement);
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

              <Box sx={editingQuestionContentStyle}>{getQuestionContentByType(question, inputRef)}</Box>

              <Box sx={editingQuestionFooterStyle}>
                {shouldShowMandatorySwitch(question) && (
                  <Box sx={mandatorySwitchContainerStyle}>
                    <Switch checked={question.mandatory} onChange={handleMandatoryChange} />
                    <Typography>{t("formulaire.mandatory")}</Typography>
                  </Box>
                )}

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
            <EllipsisWithTooltip
              typographyProps={{
                variant: TypographyVariant.H6,
                color: question.title ? undefined : TEXT_SECONDARY_COLOR,
              }}
            >
              {question.title || t("formulaire.question.title.empty")}
            </EllipsisWithTooltip>
            {question.mandatory && (
              <Typography component={BoxComponentType.SPAN} color={ERROR_MAIN_COLOR} sx={mandatoryTitleStyle}>
                *
              </Typography>
            )}
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
          title={t("formulaire.question.field.error")}
          children={t("formulaire.question.cursor.inconsistency.between.values")}
          sx={questionAlertStyle}
        />
      )}
    </Box>
  );
};
