import {
  Alert,
  Box,
  ClickAwayListener,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@cgi-learning-hub/ui";
import { useSortable } from "@dnd-kit/sortable";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTransformStyle } from "~/components/CreationSortableItem/utils";
import { FORMULAIRE, MOUSE_EVENT_DOWN, TOUCH_EVENT_START } from "~/core/constants";
import { ModalType } from "~/core/enums";
import { isValidFormElement } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import {
  isCursorChoiceConsistent,
  isFormElementQuestionRoot,
  shouldShowConditionalSwitch,
  shouldShowMandatorySwitch,
} from "~/core/models/question/utils";
import { ERROR_MAIN_COLOR, TEXT_PRIMARY_COLOR, TEXT_SECONDARY_COLOR } from "~/core/style/colors";
import { AlertSeverityVariant, BoxComponentType, ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { DndElementType } from "~/hook/dnd-hooks/enum";
import { useCreation } from "~/providers/CreationProvider";
import { useClickAwayEditingElement } from "~/providers/CreationProvider/hook/useClickAwayEditingElement";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useGlobal } from "~/providers/GlobalProvider";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { UndoConfirmationModal } from "../UndoConfirmationModal";
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
import { ICreationQuestionWrapperProps } from "./types";
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
    selectAllTextInput,
  } = useGlobal();
  const [currentQuestionTitle, setCurrentQuestionTitle] = useState<string>(question.title ?? "");
  const isEditing = isCurrentEditingElement(question, currentEditingElement);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: question.id ?? 0,
    data: { element: question, dndElementType: isFormElementQuestionRoot(question) ? DndElementType.QUESTION_ROOT : DndElementType.QUESTION_SECTION },
  });

  const style = useMemo(() => getTransformStyle(transform, transition), [transform, transition]);

  useEffect(() => {
    if (!isEditing) setCurrentQuestionTitle(question.title ?? "");
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
    <Box style={style} ref={setNodeRef}>
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
                  onFocus={selectAllTextInput}
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
                  <Tooltip title={t("formulaire.duplicate")} placement="top" disableInteractive>
                    <IconButton aria-label="duplicate" onClick={handleDuplicate}>
                      <FileCopyRoundedIcon sx={editingQuestionIconStyle} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("formulaire.delete")} placement="top" disableInteractive>
                    <IconButton aria-label="delete" onClick={handleDelete}>
                      <DeleteRoundedIcon sx={editingQuestionIconStyle} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("formulaire.cancel")} placement="top" disableInteractive>
                    <IconButton aria-label="undo" onClick={handleUndo}>
                      <UndoRoundedIcon sx={editingQuestionIconStyle} />
                    </IconButton>
                  </Tooltip>
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
          <Box sx={dragIconContainerStyle} {...attributes} {...listeners}>
            <DragIndicatorRoundedIcon sx={dragIconStyle} />
          </Box>
          <Box sx={questionTitleStyle}>
            <Typography
              color={question.title ? TEXT_PRIMARY_COLOR : TEXT_SECONDARY_COLOR}
              variant={TypographyVariant.H6}
            >
              {question.title || t("formulaire.question.title.empty")}
            </Typography>
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
