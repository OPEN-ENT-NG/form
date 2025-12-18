import {
  Alert,
  Box,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
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
import { IconButtonTooltiped } from "~/components/IconButtonTooltiped/IconButtonTooltiped";
import { FORMULAIRE } from "~/core/constants";
import { ClickAwayDataType, ModalType } from "~/core/enums";
import { isQuestion, isValidFormElement } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import {
  getQuestionTypeFromValue,
  isCursorChoiceConsistent,
  isQuestionRoot,
  shouldShowConditionalSwitch,
  shouldShowMandatorySwitch,
} from "~/core/models/question/utils";
import { ERROR_MAIN_COLOR, TEXT_PRIMARY_COLOR, TEXT_SECONDARY_COLOR } from "~/core/style/colors";
import { AlertSeverityVariant, BoxComponentType, ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { DndElementType } from "~/hook/dnd-hooks/useCreationDnd/enum";
import { useCreation } from "~/providers/CreationProvider";
import { useClickAwayEditingElement } from "~/providers/CreationProvider/hook/useClickAwayEditingElement";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useGlobal } from "~/providers/GlobalProvider";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { UndoConfirmationModal } from "../UndoConfirmationModal";
import {
  conditionalSwitchContainerStyle,
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
  StyledDragContainer,
  StyledPaper,
} from "./style";
import { ICreationQuestionWrapperProps } from "./types";
import { getQuestionContentByType } from "./utils";
import { flexStartBoxStyle } from "~/core/style/boxStyles";
import { hasFormResponses } from "~/core/models/form/utils";

export const CreationQuestionWrapper: FC<ICreationQuestionWrapperProps> = ({ question, isPreview }) => {
  const { t } = useTranslation(FORMULAIRE);
  const {
    form,
    formElementsList,
    currentEditingElement,
    setCurrentEditingElement,
    handleDuplicateFormElement,
    handleDeleteFormElement,
    saveQuestion,
    setFormElementsList,
  } = useCreation();
  const {
    displayModals: { showQuestionUndo, showQuestionDelete },
    toggleModal,
    selectAllTextInput,
  } = useGlobal();
  const [currentQuestionTitle, setCurrentQuestionTitle] = useState<string>(question.title ?? "");
  const [matrixType, setMatrixType] = useState<QuestionTypes>(
    question.children?.[0]?.questionType ?? QuestionTypes.SINGLEANSWERRADIO,
  );
  const isEditing = isCurrentEditingElement(question, currentEditingElement);
  const inputRef = useRef<HTMLInputElement>(null);
  const dndElementType = useMemo(() => {
    return isQuestionRoot(question) ? DndElementType.QUESTION_ROOT : DndElementType.QUESTION_SECTION;
  }, [question]);

  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: `${dndElementType}-${question.id}`,
    data: {
      element: question,
      dndElementType,
      questionId: question.id,
    },
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

  const { handleClickAway } = useClickAwayEditingElement(
    handleDeleteFormElement,
    setCurrentEditingElement,
    formElementsList,
    setFormElementsList,
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

  const handleSelectMatrixType = (event: SelectChangeEvent) => {
    const selectedQuestionType = getQuestionTypeFromValue(event.target.value);
    if (selectedQuestionType) {
      setCurrentEditingElement((prev) => {
        if (!prev || !isQuestion(prev)) return prev;
        const newChildren = prev.children?.map((child) => ({ ...child, questionType: selectedQuestionType }));
        return { ...prev, children: newChildren };
      });
      setMatrixType(selectedQuestionType);
    }
  };

  return (
    <Box
      style={style}
      ref={setNodeRef}
      data-type={ClickAwayDataType.QUESTION}
      onClick={(e) => {
        handleClickAway(e, currentEditingElement, question);
      }}
    >
      {isEditing ? (
        <Box>
          <StyledPaper isValidFormElement={isValidFormElement(question)}>
            <Box sx={flexStartBoxStyle}>
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
              {form && !hasFormResponses(form) && question.questionType === QuestionTypes.MATRIX && (
                <Select
                  value={matrixType.toString()}
                  onChange={handleSelectMatrixType}
                  onClick={(e) => e.stopPropagation()}
                  sx={{ width: "30%", marginRight: "3rem" }}
                >
                  <MenuItem value={QuestionTypes.SINGLEANSWERRADIO}>
                    {t("formulaire.matrix.type.SINGLEANSWERRADIO")}
                  </MenuItem>
                  <MenuItem value={QuestionTypes.MULTIPLEANSWER}>{t("formulaire.matrix.type.MULTIPLEANSWER")}</MenuItem>
                </Select>
              )}
            </Box>

            <Box sx={editingQuestionContentStyle}>{getQuestionContentByType(question, inputRef, matrixType)}</Box>

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
                <IconButtonTooltiped
                  icon={<FileCopyRoundedIcon sx={editingQuestionIconStyle} />}
                  onClick={handleDuplicate}
                  tooltipI18nKey={"formulaire.duplicate"}
                  ariaLabel="duplicate"
                />
                <IconButtonTooltiped
                  icon={<DeleteRoundedIcon sx={editingQuestionIconStyle} />}
                  onClick={handleDelete}
                  tooltipI18nKey={"formulaire.delete"}
                  ariaLabel="delete"
                />
                <IconButtonTooltiped
                  icon={<UndoRoundedIcon sx={editingQuestionIconStyle} />}
                  onClick={handleUndo}
                  tooltipI18nKey={"formulaire.cancel"}
                  ariaLabel="undo"
                />
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
      ) : (
        <Stack
          component={Paper}
          sx={questionStackStyle}
          onClick={() => {
            setCurrentEditingElement(question);
          }}
        >
          <StyledDragContainer isPreview={!!isPreview} {...attributes} {...listeners}>
            <DragIndicatorRoundedIcon sx={dragIconStyle} />
          </StyledDragContainer>
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
          <Box>{getQuestionContentByType(question, null, matrixType)}</Box>
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
