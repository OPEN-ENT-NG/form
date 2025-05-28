import { ChangeEvent, FC } from "react";
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

export const CreationQuestionWrapper: FC<ICreationQuestionWrapperProps> = ({ question }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { isCurrentEditingElement, setCurrentEditingElement, onClickAwayEditingElement } = useCreation();

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentEditingElement({
      ...question,
      title: event.target.value,
    });
  };

  const handleClickAway = () => {
    onClickAwayEditingElement();
  };

  if (!isCurrentEditingElement(question)) {
    return (
      <Box>
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
            <Typography>Content + {question.questionType} </Typography>
          </Box>
        </Stack>
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
  }

  return (
    <Box>
      <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={handleClickAway}>
        <Stack component={Paper} sx={editingQuestionStackStyle}>
          <Box>
            <TextField
              variant={ComponentVariant.STANDARD}
              fullWidth
              sx={editingQuestionTitleStyle}
              placeholder={t("formulaire.question.title.empty")}
              value={question.title}
              onChange={handleTitleChange}
            />
          </Box>
          <Box>
            <Typography variant={TypographyVariant.H6} sx={editingQuestionContentStyle}>
              Content + {question.questionType}
            </Typography>
          </Box>
          <Box sx={editingQuestionFooterStyle}>
            <Switch />
            <Typography>{t("formulaire.mandatory")}</Typography>
            <Box sx={editingQuestionIconContainerStyle}>
              <IconButton aria-label="copy">
                <FileCopyRoundedIcon sx={editingQuestionIconStyle} />
              </IconButton>
              <IconButton aria-label="delete">
                <DeleteRoundedIcon sx={editingQuestionIconStyle} />
              </IconButton>
              <IconButton aria-label="undo">
                <UndoRoundedIcon sx={editingQuestionIconStyle} />
              </IconButton>
            </Box>
          </Box>
        </Stack>
      </ClickAwayListener>
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
