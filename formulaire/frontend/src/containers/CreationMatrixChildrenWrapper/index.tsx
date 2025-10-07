import { Box, ClickAwayListener, IconButton, TextField, Typography } from "@cgi-learning-hub/ui";
import { FC, useMemo, useRef, useState } from "react";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";
import { UpDownButtons } from "~/components/UpDownButtons";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, MOUSE_EVENT_DOWN, TOUCH_EVENT_START } from "~/core/constants";
import { ComponentSize, ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SortByAlphaRoundedIcon from "@mui/icons-material/SortByAlphaRounded";
import { iconStyle } from "~/components/UpDownButtons/style";
import {
  baseChoiceWrapperStyle,
  choiceInputStyle,
  choiceStyle,
  choicesWrapperStyle,
  choiceWrapperStyle,
  deleteButtonIconStyle,
  deleteWrapperStyle,
  newChoiceInputStyle,
  NewChoiceWrapper,
  notEditingchoicesWrapperStyle,
  sortIconStyle,
  sortWrapperStyle,
  StyledSortWrapper,
  upDownButtonsWrapperStyle,
} from "../CreationQuestionChoiceWrapper/style";
import { CreationQuestionChoice } from "~/components/CreationQuestionTypes/CreationQuestionChoice";
import { ICreationMatrixChildrenWrapperProps } from "./types";
import { IQuestion } from "~/core/models/question/types";
import { useMatrixChildrenActions } from "./useMatrixChildrenActions";
import { isEnterPressed, isShiftEnterPressed } from "~/core/utils";

export const CreationMatrixChildrenWrapper: FC<ICreationMatrixChildrenWrapperProps> = ({ question }) => {
  const { currentEditingElement, setCurrentEditingElement, setFormElementsList } = useCreation();
  const { t } = useTranslation(FORMULAIRE);
  const [newChildTitle, setNewChildrenTitle] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { handleDeleteChild, handleNewChild, handleSortClick, handleSwapClick, preventEmptyValues, updateChild } =
    useMatrixChildrenActions(question, currentEditingElement, setCurrentEditingElement, setFormElementsList);

  // in utils
  const compareChildren = (a: IQuestion, b: IQuestion): number => {
    if (!a.matrixPosition || !b.matrixPosition) return 0;
    if (a.matrixPosition < b.matrixPosition) return -1;
    if (a.matrixPosition > b.matrixPosition) return 1;
    return 0;
  };

  const sortedChildren = useMemo(() => {
    return question.children?.sort((a, b) => compareChildren(a, b)) ?? [];
  }, [question.children]);

  if (!question.children) {
    return null;
  }

  const handleKeyDownExistingChoice = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (isShiftEnterPressed(e)) {
      updateChild(index, (e.target as HTMLInputElement).value);
      const targetIndex = index - 1 >= 0 ? index - 1 : 0;
      inputRefs.current[targetIndex]?.focus();
    } else if (isEnterPressed(e)) {
      updateChild(index, (e.target as HTMLInputElement).value);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDownNewChoice = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isShiftEnterPressed(e)) {
      handleNewChild(newChildTitle);
      setNewChildrenTitle("");
      const index = question.choices?.length ?? 0;
      const targetIndex = index - 1 >= 0 ? index - 1 : 0;
      inputRefs.current[targetIndex]?.focus();
    } else if (isEnterPressed(e)) {
      handleNewChild(newChildTitle);
      setNewChildrenTitle("");
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
              {sortedChildren.map((child, index) => (
                <Box key={child.id ?? index} sx={choiceWrapperStyle}>
                  <Box sx={upDownButtonsWrapperStyle}>
                    <UpDownButtons
                      element={child}
                      index={index}
                      elementList={question.children ?? []}
                      hasCustomAtTheEnd={false}
                      handleReorderClick={handleSwapClick}
                    />
                  </Box>
                  <CreationQuestionChoice index={index} type={question.questionType} isEditing={true}>
                    <TextField
                      inputRef={(el: HTMLInputElement | null) => (inputRefs.current[index] = el)}
                      value={child.title}
                      variant={ComponentVariant.STANDARD}
                      fullWidth
                      onChange={(e) => {
                        updateChild(index, e.target.value);
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        handleKeyDownExistingChoice(e, index);
                      }}
                      disabled={false}
                      sx={choiceInputStyle}
                    />
                  </CreationQuestionChoice>
                  <Box sx={deleteWrapperStyle}>
                    {question.children && question.children.length > 1 && (
                      <IconButton
                        onClick={() => void handleDeleteChild(child.id, index, child.matrixPosition)}
                        size={ComponentSize.SMALL}
                        sx={deleteButtonIconStyle}
                      >
                        <ClearRoundedIcon sx={iconStyle} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
              <NewChoiceWrapper hasImage={false}>
                <CreationQuestionChoice index={question.children.length}>
                  <TextField
                    inputRef={(el: HTMLInputElement | null) => (inputRefs.current[question.children?.length ?? 0] = el)}
                    value={newChildTitle}
                    variant={ComponentVariant.STANDARD}
                    placeholder={t("formulaire.question.label")}
                    fullWidth
                    onBlur={() => {
                      handleNewChild(newChildTitle);
                      setNewChildrenTitle("");
                    }}
                    onChange={(e) => {
                      setNewChildrenTitle(e.target.value);
                    }}
                    onKeyDown={handleKeyDownNewChoice}
                    sx={newChoiceInputStyle}
                  />
                </CreationQuestionChoice>
              </NewChoiceWrapper>
            </Box>
          </Box>
        </ClickAwayListener>
      ) : (
        <Box sx={notEditingchoicesWrapperStyle}>
          {sortedChildren.map((question, index) => (
            <Box key={question.id ?? index} sx={baseChoiceWrapperStyle}>
              <CreationQuestionChoice index={index}>
                <TextField
                  value={question.title}
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
