import { Box, ClickAwayListener, IconButton, TextField, Typography } from "@cgi-learning-hub/ui";
import { FC, useEffect, useMemo, useRef } from "react";
import { ICreationQuestionChoiceWrapperProps } from "./types";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";
import { QuestionChoicesUpDownButtons } from "~/components/QuestionChoicesUpDownButtons";
import { compareChoices } from "./utils";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, MOUSE_EVENT_DOWN, TOUCH_EVENT_START } from "~/core/constants";
import { BoxComponentType, ComponentSize, ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { iconStyle } from "~/components/QuestionChoicesUpDownButtons/style";
import SortByAlphaRoundedIcon from "@mui/icons-material/SortByAlphaRounded";
import { useChoiceActions } from "./useChoiceActions";
import {
  baseChoiceWrapperStyle,
  choiceInputStyle,
  choiceStyle,
  choicesWrapperStyle,
  choiceWrapperStyle,
  deleteButtonIconStyle,
  deleteWrapperStyle,
  newChoiceInputStyle,
  newChoiceWrapperStyle,
  notEditingchoicesWrapperStyle,
  otherChoiceSpanStyle,
  sortIconStyle,
  sortWrapperStyle,
  upDownButtonsWrapperStyle,
} from "./style";
import { CreationQuestionChoice } from "~/components/CreationQuestionTypes/CreationQuestionChoice";
import { CreationQuestionChoiceType } from "~/components/CreationQuestionTypes/CreationQuestionChoice/enum";

export const CreationQuestionChoiceWrapper: FC<ICreationQuestionChoiceWrapperProps> = ({ question, type }) => {
  const { currentEditingElement, setCurrentEditingElement, setFormElementsList } = useCreation();
  const newChoiceInputRef = useRef<HTMLInputElement | null>(null);
  const isExistingCustomChoice = useMemo(() => question.choices?.some((choice) => choice.isCustom), [question.choices]);
  const { t } = useTranslation(FORMULAIRE);

  const {
    choices,
    handleDeleteChoice,
    handleNewChoice,
    handleSortClick,
    handleSwapClick,
    preventEmptyValues,
    updateChoice,
    updateChoiceImage,
  } = useChoiceActions(question, setCurrentEditingElement, setFormElementsList);

  const sortedChoices = useMemo(() => {
    return choices.sort((a, b) => compareChoices(a, b));
  }, [choices]);

  //When clicking on the new question, focus the last input field
  useEffect(() => {
    if (newChoiceInputRef.current) {
      newChoiceInputRef.current.focus();
    }
  }, [question.choices?.length]);

  //Is this the element we need to focus on ?
  const isInputRef = (index: number) => {
    if (isExistingCustomChoice) {
      return index === choices.length - 2 ? newChoiceInputRef : null;
    }
    return index === choices.length - 1 ? newChoiceInputRef : null;
  };

  if (!question.choices) {
    return null;
  }

  return (
    <Box>
      {isCurrentEditingElement(question, currentEditingElement) ? (
        <ClickAwayListener
          mouseEvent={MOUSE_EVENT_DOWN}
          touchEvent={TOUCH_EVENT_START}
          onClickAway={() => {
            preventEmptyValues();
          }}
        >
          <Box>
            <Box onClick={handleSortClick} sx={sortWrapperStyle}>
              <SortByAlphaRoundedIcon sx={sortIconStyle} />
              <Typography variant={TypographyVariant.BODY2}>{t("formulaire.sort")}</Typography>
            </Box>
            <Box sx={choicesWrapperStyle}>
              {sortedChoices.map((choice, index) => (
                <Box key={choice.id ?? index} sx={choiceWrapperStyle}>
                  <Box sx={upDownButtonsWrapperStyle}>
                    <QuestionChoicesUpDownButtons
                      choice={choice}
                      index={index}
                      questionChoicesList={choices}
                      handleReorderClick={handleSwapClick}
                    />
                  </Box>
                  <CreationQuestionChoice
                    index={index}
                    type={type}
                    hasImage={type === CreationQuestionChoiceType.SINGLE_ANSWER}
                    updateChoiceImage={updateChoiceImage}
                    image={choice.image ?? undefined}
                    isEditing={true}
                  >
                    <TextField
                      inputRef={isInputRef(index)}
                      value={choice.value}
                      variant={ComponentVariant.STANDARD}
                      fullWidth
                      onChange={(e) => {
                        updateChoice(index, e.target.value);
                      }}
                      disabled={choice.isCustom}
                      sx={choiceInputStyle}
                    />
                  </CreationQuestionChoice>
                  <Box sx={deleteWrapperStyle}>
                    {choices.length > 1 && (
                      <IconButton
                        onClick={() => void handleDeleteChoice(choice.id, index, choice.position)}
                        size={ComponentSize.SMALL}
                        sx={deleteButtonIconStyle}
                      >
                        <ClearRoundedIcon sx={iconStyle} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
              <Box sx={newChoiceWrapperStyle}>
                <CreationQuestionChoice index={question.choices.length} type={type}>
                  <TextField
                    value={t("formulaire.question.label")}
                    variant={ComponentVariant.STANDARD}
                    fullWidth
                    onFocus={() => {
                      handleNewChoice(false);
                    }}
                    sx={newChoiceInputStyle}
                  />
                </CreationQuestionChoice>
              </Box>
            </Box>
            <Box>
              <Typography variant={TypographyVariant.BODY2}>
                {t("formulaire.question.add.choice.other.text")}
                <Box
                  component={BoxComponentType.SPAN}
                  onClick={() => {
                    handleNewChoice(true);
                  }}
                  sx={otherChoiceSpanStyle}
                >
                  {t("formulaire.question.add.choice.other.link")}
                </Box>
              </Typography>
            </Box>
          </Box>
        </ClickAwayListener>
      ) : (
        <Box sx={notEditingchoicesWrapperStyle}>
          {sortedChoices.map((choice, index) => (
            <Box key={choice.id ?? index} sx={baseChoiceWrapperStyle}>
              <CreationQuestionChoice index={index} type={type} image={choice.image ?? undefined}>
                <TextField
                  value={choice.value}
                  variant={ComponentVariant.STANDARD}
                  fullWidth
                  slotProps={{ htmlInput: { readOnly: true } }}
                  sx={choiceStyle}
                />
              </CreationQuestionChoice>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
