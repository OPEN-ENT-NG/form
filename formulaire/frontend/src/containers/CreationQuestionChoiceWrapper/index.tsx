import { Box, IconButton, TextField, Typography } from "@cgi-learning-hub/ui";
import { FC, useMemo, useRef, useState } from "react";
import { ICreationQuestionChoiceWrapperProps } from "./types";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";
import { UpDownButtons } from "~/components/UpDownButtons";
import { compareChoices, hasImageType } from "./utils";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { BoxComponentType, ComponentSize, ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { iconStyle } from "~/components/UpDownButtons/style";
import SortByAlphaRoundedIcon from "@mui/icons-material/SortByAlphaRounded";
import { useChoiceActions } from "./useChoiceActions";
import {
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
  customChoiceWrapperStyle,
  choicesWrapperWhenNotEditingStyle,
} from "./style";
import { CreationQuestionChoice } from "~/components/CreationQuestionTypes/CreationQuestionChoice";
import { CreationQuestionChoiceConditional } from "~/components/CreationQuestionChoiceConditional";
import { isEnterPressed, isShiftEnterPressed } from "~/core/utils";
import { useGlobal } from "~/providers/GlobalProvider";
import { QuestionTypes } from "~/core/models/question/enum";

export const CreationQuestionChoiceWrapper: FC<ICreationQuestionChoiceWrapperProps> = ({
  question,
  type,
  hideCustomChoice = false,
}) => {
  const { currentEditingElement, setCurrentEditingElement } = useCreation();
  const { selectAllTextInput } = useGlobal();
  const { t } = useTranslation(FORMULAIRE);
  const [newChoiceValue, setNewChoiceValue] = useState<string>("");
  const inputRefs = useRef<Record<string | number, HTMLInputElement | null>>({});
  const newChoiceRefName = "newChoice";

  const {
    choices,
    handleDeleteChoice,
    handleNewChoice,
    handleSortClick,
    handleSwapClick,
    updateChoice,
    updateChoiceImage,
    updateChoiceNextFormElement,
  } = useChoiceActions(question, setCurrentEditingElement);

  const sortedChoices = useMemo(() => {
    return choices.filter((c) => !c.isCustom).sort((a, b) => compareChoices(a, b));
  }, [choices]);

  const customChoice = useMemo(() => {
    return choices.find((c) => c.isCustom);
  }, [choices]);

  if (!question.choices) {
    return null;
  }

  const handleKeyDownExistingChoice = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (isShiftEnterPressed(e)) {
      updateChoice(index, (e.target as HTMLInputElement).value);
      const targetIndex = index - 1 >= 0 ? index - 1 : 0;
      const targetChoice = choices[targetIndex];
      if (!targetChoice.stableId) return;
      inputRefs.current[targetChoice.stableId]?.focus();
    } else if (isEnterPressed(e)) {
      updateChoice(index, (e.target as HTMLInputElement).value);
      const targetChoiceStableId = choices[index + 1] ? choices[index + 1].stableId : newChoiceRefName;
      if (!targetChoiceStableId) return;
      inputRefs.current[targetChoiceStableId]?.focus();
    }
  };

  const handleKeyDownNewChoice = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isShiftEnterPressed(e)) {
      const targetIndex = choices.length - 1 >= 0 ? choices.length - 1 : 0;
      const targetChoice = choices[targetIndex];
      if (!targetChoice.stableId) return;
      inputRefs.current[targetChoice.stableId]?.focus();
    } else if (isEnterPressed(e)) {
      handleNewChoice(false, newChoiceValue);
      setNewChoiceValue("");
    }
  };

  const getPlaceholder = () => {
    return question.questionType === QuestionTypes.MATRIX
      ? t("formulaire.matrix.column.label.default", { 0: "" })
      : t("formulaire.question.option");
  };

  const renderChoicesWhenNotEditing = () => {
    const allChoices = customChoice ? [...sortedChoices, customChoice] : sortedChoices;
    return allChoices.map((choice, index) => (
      <Box key={choice.stableId} sx={choicesWrapperWhenNotEditingStyle}>
        <CreationQuestionChoice index={index} type={type} image={choice.image ?? undefined}>
          <TextField
            value={choice.value}
            variant={ComponentVariant.STANDARD}
            fullWidth
            slotProps={{ htmlInput: { readOnly: true } }}
            sx={{ ...unselectedChoiceStyle, marginRight: question.conditional ? "4rem" : 0 }}
          />
        </CreationQuestionChoice>
        {question.conditional && <CreationQuestionChoiceConditional question={question} choice={choice} />}
      </Box>
    ));
  };

  return (
    <Box>
      {isCurrentEditingElement(question, currentEditingElement) ? (
        <Box>
          <StyledSortWrapper isConditional={question.conditional}>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                handleSortClick();
              }}
              sx={sortWrapperStyle}
            >
              <SortByAlphaRoundedIcon sx={sortIconStyle} />
              <Typography variant={TypographyVariant.BODY2}>{t("formulaire.sort")}</Typography>
            </Box>
          </StyledSortWrapper>
          <Box sx={choicesWrapperStyle}>
            {/* Classic choices */}
            {sortedChoices.map((choice, index) => (
              <Box key={choice.stableId} sx={choiceWrapperStyle}>
                <Box sx={upDownButtonsWrapperStyle}>
                  <UpDownButtons
                    element={choice}
                    index={index}
                    elementList={choices}
                    hasCustomAtTheEnd={!!customChoice}
                    handleReorderClick={handleSwapClick}
                  />
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
                    inputRef={(el: HTMLInputElement | null) => {
                      if (!choice.stableId) return;
                      inputRefs.current[choice.stableId] = el;
                    }}
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
                    sx={choiceInputStyle}
                  />
                </CreationQuestionChoice>
                <Box sx={deleteWrapperStyle}>
                  {choices.length > 1 && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDeleteChoice(choice.id, index, choice.position);
                      }}
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

            {/* New empty choice */}
            <NewChoiceWrapper key="newChoice" hasImage={hasImageType(type)}>
              <CreationQuestionChoice index={choices.length} type={type}>
                <TextField
                  inputRef={(el: HTMLInputElement | null) => (inputRefs.current[newChoiceRefName] = el)}
                  value={newChoiceValue}
                  variant={ComponentVariant.STANDARD}
                  placeholder={getPlaceholder()}
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

            {/* Custom choice */}
            {customChoice &&
              (() => {
                const customChoiceIndex = choices.length - 1;
                return (
                  <Box sx={customChoiceWrapperStyle}>
                    <CreationQuestionChoice
                      index={customChoiceIndex}
                      type={type}
                      hasImage={hasImageType(type)}
                      updateChoiceImage={updateChoiceImage}
                      image={customChoice.image ?? undefined}
                      isEditing={true}
                    >
                      <TextField
                        inputRef={(el: HTMLInputElement | null) => {
                          if (!customChoice.stableId) return;
                          inputRefs.current[customChoice.stableId] = el;
                        }}
                        value={customChoice.value}
                        variant={ComponentVariant.STANDARD}
                        fullWidth
                        disabled
                        sx={choiceInputStyle}
                      />
                    </CreationQuestionChoice>
                    <Box sx={deleteWrapperStyle}>
                      {choices.length > 1 && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleDeleteChoice(customChoice.id, customChoiceIndex, customChoice.position);
                          }}
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
                        choice={customChoice}
                        choiceIndex={choices.length - 1}
                        updateChoiceNextFormElement={updateChoiceNextFormElement}
                      />
                    )}
                  </Box>
                );
              })()}
          </Box>
          {!hideCustomChoice && !customChoice && (
            <Box>
              <Typography variant={TypographyVariant.BODY2}>
                {t("formulaire.question.add.choice.other.text")}
                <Box
                  component={BoxComponentType.SPAN}
                  onClick={(e) => {
                    e.stopPropagation();
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
      ) : (
        <Box sx={notEditingchoicesWrapperStyle}>{renderChoicesWhenNotEditing()}</Box>
      )}
    </Box>
  );
};
