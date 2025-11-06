import { Box, ClickAwayListener, IconButton, TextField, Typography } from "@cgi-learning-hub/ui";
import { FC, useMemo, useRef, useState } from "react";
import { ICreationQuestionChoiceWrapperProps } from "./types";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";
import { UpDownButtons } from "~/components/UpDownButtons";
import { compareChoices, hasImageType } from "./utils";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, MOUSE_EVENT_DOWN, TOUCH_EVENT_START } from "~/core/constants";
import { BoxComponentType, ComponentSize, ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { iconStyle } from "~/components/UpDownButtons/style";
import SortByAlphaRoundedIcon from "@mui/icons-material/SortByAlphaRounded";
import { useChoiceActions } from "./useChoiceActions";
import {
  baseChoiceWrapperStyle,
  choiceInputStyle,
  unselectedChoiceStyle,
  choicesWrapperStyle,
  choiceWrapperStyle,
  deleteButtonIconStyle,
  deleteWrapperStyle,
  newChoiceInputStyle,
  NewChoiceWrapper,
  notEditingchoicesWrapperStyle,
  otherChoiceSpanStyle,
  sortIconStyle,
  sortWrapperStyle,
  StyledSortWrapper,
  upDownButtonsWrapperStyle,
} from "./style";
import { CreationQuestionChoice } from "~/components/CreationQuestionTypes/CreationQuestionChoice";
import { CreationQuestionChoiceConditional } from "~/components/CreationQuestionChoiceConditional";
import { isEnterPressed, isShiftEnterPressed } from "~/core/utils";
import { useGlobal } from "~/providers/GlobalProvider";

export const CreationQuestionChoiceWrapper: FC<ICreationQuestionChoiceWrapperProps> = ({
  question,
  type,
  hideCustomChoice = false,
  choiceValueI18nKey = null,
}) => {
  const { currentEditingElement, setCurrentEditingElement, setFormElementsList } = useCreation();
  const { selectAllTextInput } = useGlobal();
  const { t } = useTranslation(FORMULAIRE);
  const [newChoiceValue, setNewChoiceValue] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleDeleteChoice,
    handleNewChoice,
    handleSortClick,
    handleSwapClick,
    preventEmptyValues,
    updateChoice,
    updateChoiceImage,
    updateChoiceNextFormElement,
  } = useChoiceActions(
    question,
    currentEditingElement,
    setCurrentEditingElement,
    setFormElementsList,
    choiceValueI18nKey,
  );

  const sortedChoices = useMemo(() => {
    return question.choices?.sort((a, b) => compareChoices(a, b)) ?? [];
  }, [question.choices]);

  if (!question.choices) {
    return null;
  }

  const handleKeyDownExistingChoice = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (isShiftEnterPressed(e)) {
      updateChoice(index, (e.target as HTMLInputElement).value);
      const targetIndex = index - 1 >= 0 ? index - 1 : 0;
      inputRefs.current[targetIndex]?.focus();
    } else if (isEnterPressed(e)) {
      updateChoice(index, (e.target as HTMLInputElement).value);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDownNewChoice = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isShiftEnterPressed(e)) {
      handleNewChoice(false, newChoiceValue);
      setNewChoiceValue("");
      const index = question.choices?.length ?? 0;
      const targetIndex = index - 1 >= 0 ? index - 1 : 0;
      inputRefs.current[targetIndex]?.focus();
    } else if (isEnterPressed(e)) {
      handleNewChoice(false, newChoiceValue);
      setNewChoiceValue("");
    }
  };

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
            <StyledSortWrapper isConditional={question.conditional}>
              <Box onClick={handleSortClick} sx={sortWrapperStyle}>
                <SortByAlphaRoundedIcon sx={sortIconStyle} />
                <Typography variant={TypographyVariant.BODY2}>{t("formulaire.sort")}</Typography>
              </Box>
            </StyledSortWrapper>
            <Box sx={choicesWrapperStyle}>
              {sortedChoices.map((choice, index) => (
                <Box key={choice.id ?? index} sx={choiceWrapperStyle}>
                  <Box sx={upDownButtonsWrapperStyle}>
                    {!choice.isCustom && (
                      <UpDownButtons
                        element={choice}
                        index={index}
                        elementList={question.choices ?? []}
                        hasCustomAtTheEnd={sortedChoices[sortedChoices.length - 1].isCustom}
                        handleReorderClick={handleSwapClick}
                      />
                    )}
                  </Box>
                  <CreationQuestionChoice
                    index={index}
                    type={type}
                    hasImage={hasImageType(type)}
                    updateChoiceImage={updateChoiceImage}
                    image={choice.image ?? undefined}
                    isEditing={true}
                  >
                    <TextField
                      inputRef={(el: HTMLInputElement | null) => (inputRefs.current[index] = el)}
                      value={choice.value}
                      variant={ComponentVariant.STANDARD}
                      fullWidth
                      onFocus={selectAllTextInput}
                      onChange={(e) => {
                        updateChoice(index, e.target.value);
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        handleKeyDownExistingChoice(e, index);
                      }}
                      disabled={choice.isCustom}
                      sx={choiceInputStyle}
                    />
                  </CreationQuestionChoice>
                  <Box sx={deleteWrapperStyle}>
                    {question.choices && question.choices.length > 1 && (
                      <IconButton
                        onClick={() => void handleDeleteChoice(choice.id, index, choice.position)}
                        size={ComponentSize.SMALL}
                        sx={deleteButtonIconStyle}
                      >
                        <ClearRoundedIcon sx={iconStyle} />
                      </IconButton>
                    )}
                  </Box>
                  {question.conditional && (
                    <CreationQuestionChoiceConditional
                      question={question}
                      choice={choice}
                      choiceIndex={index}
                      updateChoiceNextFormElement={updateChoiceNextFormElement}
                    />
                  )}
                </Box>
              ))}
              <NewChoiceWrapper hasImage={hasImageType(type)}>
                <CreationQuestionChoice index={question.choices.length} type={type}>
                  <TextField
                    inputRef={(el: HTMLInputElement | null) => (inputRefs.current[question.choices?.length ?? 0] = el)}
                    value={newChoiceValue}
                    variant={ComponentVariant.STANDARD}
                    placeholder={t("formulaire.question.option")}
                    fullWidth
                    onFocus={selectAllTextInput}
                    onBlur={() => {
                      handleNewChoice(false, newChoiceValue);
                      setNewChoiceValue("");
                    }}
                    onChange={(e) => {
                      setNewChoiceValue(e.target.value);
                    }}
                    onKeyDown={handleKeyDownNewChoice}
                    sx={newChoiceInputStyle}
                  />
                </CreationQuestionChoice>
              </NewChoiceWrapper>
            </Box>
            {!hideCustomChoice && (
              <Box>
                <Typography variant={TypographyVariant.BODY2}>
                  {t("formulaire.question.add.choice.other.text")}
                  <Box
                    component={BoxComponentType.SPAN}
                    onClick={() => {
                      handleNewChoice(true, t("formulaire.other"));
                    }}
                    sx={otherChoiceSpanStyle}
                  >
                    {t("formulaire.question.add.choice.other.link")}
                  </Box>
                </Typography>
              </Box>
            )}
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
                  sx={unselectedChoiceStyle}
                />
              </CreationQuestionChoice>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
