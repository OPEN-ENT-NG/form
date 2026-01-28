import { FC } from "react";
import { Dialog, DialogTitle, DialogContent, Box, Stack, Card, Tooltip, Typography } from "@cgi-learning-hub/ui";
import { TypographyFontStyle, TypographyVariant } from "~/core/style/themeProps";
import { useTranslation } from "react-i18next";
import { DEFAULT_NB_CHILDREN, DEFAULT_NB_CHOICES, FORMULAIRE } from "~/core/constants";
import { ButtonBase, Grid2 } from "@mui/material";
import { SECONDARY } from "~/core/style/colors";
import { useGetQuestionTypesQuery } from "~/services/api/services/formulaireApi/questionApi";
import { displayTypeDescription, displayTypeName } from "./utils";
import { ICreateFormElementModalProps } from "./types";
import { createNewSection } from "~/core/models/section/utils";
import { IFormElement } from "~/core/models/formElement/types";
import { FormElementType } from "~/core/models/formElement/enum";
import { useCreation } from "~/providers/CreationProvider";
import { createNewQuestion, createNewQuestionChoice, isTypeChoicesQuestion } from "~/core/models/question/utils";
import { IQuestion } from "~/core/models/question/types";
import { QuestionTypes } from "~/core/models/question/enum";
import {
  createFormElementModalPaperStyle,
  createFormElementModalContentStyle,
  sectionButtonStyle,
  questionGridStyle,
  questionButtonStyle,
  questionStackStyle,
  questionStyle,
  iconContainerStyle,
  questionTextStyle,
} from "./style";
import { questionTypeIcons } from "./const";

export const CreateFormElementModal: FC<ICreateFormElementModalProps> = ({
  isOpen,
  handleClose,
  showSection = true,
  parentSection = null,
}) => {
  const { t } = useTranslation(FORMULAIRE);
  const { form, formElementsList, setFormElementsList, setCurrentEditingElement } = useCreation();

  const { data: questionTypes } = useGetQuestionTypesQuery();

  if (!form) {
    return null;
  }

  const handleFormElementCreation = (questionTypeCode?: QuestionTypes) => {
    const newFormElement: IFormElement =
      questionTypeCode !== undefined ? createNewQuestion(form.id, questionTypeCode) : createNewSection(form.id);
    newFormElement.selected = true;

    if (newFormElement.formElementType === FormElementType.QUESTION) {
      const newQuestion = newFormElement as IQuestion;

      //Add choices (and children for matrix)
      if (isTypeChoicesQuestion(newQuestion.questionType)) {
        const isMatrix = newQuestion.questionType === QuestionTypes.MATRIX;
        const choiceI18nKey = isMatrix ? "formulaire.matrix.column.label.default" : "formulaire.option";
        newQuestion.choices = Array.from({ length: DEFAULT_NB_CHOICES }, (_, i) =>
          createNewQuestionChoice(
            newQuestion.id,
            i + 1,
            null,
            t(choiceI18nKey, { 0: i + 1 }),
            undefined,
            crypto.randomUUID(),
          ),
        );

        if (isMatrix) {
          newQuestion.children = Array.from({ length: DEFAULT_NB_CHILDREN }, (_, i) =>
            createNewQuestion(
              newQuestion.formId,
              QuestionTypes.SINGLEANSWERRADIO,
              newQuestion.id,
              i + 1,
              t("formulaire.matrix.line.label.default", { 0: i + 1 }),
              crypto.randomUUID(),
            ),
          );
        }
      }

      //If inside a section, set sectionId and sectionPosition
      if (parentSection) {
        newQuestion.sectionId = parentSection.id;
        newQuestion.sectionPosition = parentSection.questions.length + 1;
        parentSection.questions = [...parentSection.questions, newQuestion];
      }
    }

    // If the parent section is not defined, add the new form element to the end of the list
    if (!parentSection) {
      newFormElement.position = formElementsList.length + 1;
      setFormElementsList((prevFormElementList) => [...prevFormElementList, newFormElement]);
    }

    setCurrentEditingElement(newFormElement);
    handleClose();
    return;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: createFormElementModalPaperStyle,
        },
      }}
    >
      <DialogTitle>{t("formulaire.element.new.title")}</DialogTitle>

      <DialogContent sx={createFormElementModalContentStyle}>
        <Stack spacing={3}>
          {showSection && (
            <Stack spacing={2}>
              <Typography variant={TypographyVariant.BODY1}>{t("formulaire.element.page.layout")}</Typography>
              <Card
                component={ButtonBase}
                sx={sectionButtonStyle}
                onClick={() => {
                  handleFormElementCreation();
                }}
              >
                <Typography fontWeight={TypographyFontStyle.BOLD} color={SECONDARY}>
                  {t("formulaire.element.new.section.title")}
                </Typography>
                <Typography variant={TypographyVariant.BODY2}>
                  {t("formulaire.element.new.section.description")}
                </Typography>
              </Card>
            </Stack>
          )}

          {questionTypes && (
            <Stack spacing={2} sx={questionStyle}>
              <Typography variant={TypographyVariant.BODY1}>{t("formulaire.element.questions")}</Typography>
              <Grid2 container spacing={2} justifyContent="center">
                {questionTypes.map((questionType) => (
                  <Grid2 key={questionType.id} size={{ md: 3 }} sx={questionGridStyle}>
                    <Tooltip title={displayTypeDescription(questionType.name)} placement="top" disableInteractive>
                      <Card
                        component={ButtonBase}
                        sx={questionButtonStyle}
                        onClick={() => {
                          handleFormElementCreation(questionType.code);
                        }}
                      >
                        <Stack spacing={1.5} sx={questionStackStyle}>
                          <Typography
                            variant={TypographyVariant.BODY2}
                            fontWeight={TypographyFontStyle.BOLD}
                            color={SECONDARY}
                            sx={questionTextStyle}
                          >
                            {displayTypeName(questionType.name)}
                          </Typography>
                          <Box sx={iconContainerStyle}>{questionTypeIcons[questionType.code]}</Box>
                        </Stack>
                      </Card>
                    </Tooltip>
                  </Grid2>
                ))}
              </Grid2>
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
