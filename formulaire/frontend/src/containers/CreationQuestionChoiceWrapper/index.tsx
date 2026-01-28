import { Box, IconButton, TextField, Typography } from "@cgi-learning-hub/ui";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SortByAlphaRoundedIcon from "@mui/icons-material/SortByAlphaRounded";
import { FC, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { CreationQuestionChoiceConditional } from "~/components/CreationQuestionChoiceConditional";
import { CreationQuestionChoice } from "~/components/CreationQuestionTypes/CreationQuestionChoice";
import { iconStyle } from "~/components/UpDownButtons/style";
import { FORMULAIRE } from "~/core/constants";
import { QuestionTypes } from "~/core/models/question/enum";
import { BoxComponentType, ComponentSize, ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { isEnterPressed, isShiftEnterPressed } from "~/core/utils";
import { useCreation } from "~/providers/CreationProvider";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useGlobal } from "~/providers/GlobalProvider";
import { EditableChoiceRow } from "./EditableChoiceRow";

import {
  choiceInputStyle,
  choicesWrapperStyle,
  choicesWrapperWhenNotEditingStyle,
  customChoiceWrapperStyle,
  deleteButtonIconStyle,
  deleteWrapperStyle,
  newChoiceInputStyle,
  NewChoiceWrapper,
  notEditingchoicesWrapperStyle,
  otherChoiceSpanStyle,
  sortIconStyle,
  sortWrapperStyle,
  StyledSortWrapper,
  unselectedChoiceStyle,
} from "./style";
import { ICreationQuestionChoiceWrapperProps } from "./types";
import { useChoiceActions } from "./useChoiceActions";
import { compareChoices, hasImageType } from "./utils";

export const CreationQuestionChoiceWrapper: FC<ICreationQuestionChoiceWrapperProps> = ({
  question,
  type,
  hideCustomChoice = false,
}) => {
  const { currentEditingElement, setCurrentEditingElement, newChoiceValue, setNewChoiceValue } = useCreation();
  const { selectAllTextInput } = useGlobal();
  const { t } = useTranslation(FORMULAIRE);
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
    return [...choices].filter((c) => !c.isCustom).sort((a, b) => compareChoices(a, b));
  }, [choices]);

  const customChoice = useMemo(() => {
    return choices.find((c) => c.isCustom);
  }, [choices]);

  if (!question.choices) {
    return null;
  }

  const handleKeyDownExistingChoice = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
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
              <EditableChoiceRow
                key={choice.stableId}
                choice={choice}
                index={index}
                choices={choices}
                customChoice={customChoice}
                type={type}
                question={question}
                inputRefs={inputRefs}
                updateChoice={updateChoice}
                updateChoiceImage={updateChoiceImage}
                updateChoiceNextFormElement={updateChoiceNextFormElement}
                handleDeleteChoice={handleDeleteChoice}
                handleSwapClick={handleSwapClick}
                handleKeyDownExistingChoice={handleKeyDownExistingChoice}
                selectAllTextInput={selectAllTextInput}
              />
            ))}
            {/* New empty choice */}
            <NewChoiceWrapper key="newChoice" hasImage={hasImageType(type)}>
              <CreationQuestionChoice
                index={choices.length}
                type={type}
                displayedIndex={customChoice ? choices.length - 1 : choices.length}
              >
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
                      displayedIndex={choices.length}
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
