import { Box, TextField, Typography } from "@cgi-learning-hub/ui";
import SortByAlphaRoundedIcon from "@mui/icons-material/SortByAlphaRounded";
import { FC, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreationQuestionChoice } from "~/components/CreationQuestionTypes/CreationQuestionChoice";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { isEnterPressed, isShiftEnterPressed } from "~/core/utils";
import { useCreation } from "~/providers/CreationProvider";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useGlobal } from "~/providers/GlobalProvider";
import {
  baseChoiceWrapperStyle,
  choicesWrapperStyle,
  newChoiceInputStyle,
  NewChoiceWrapper,
  notEditingchoicesWrapperStyle,
  sortIconStyle,
  sortWrapperStyle,
  StyledSortWrapper,
  unselectedChoiceStyle,
} from "../CreationQuestionChoiceWrapper/style";
import { EditableChildrenRow } from "./EditableChildrenRow";
import { ICreationMatrixChildrenWrapperProps } from "./types";
import { useMatrixChildrenActions } from "./useMatrixChildrenActions";
import { compareChildren } from "./utils";

export const CreationMatrixChildrenWrapper: FC<ICreationMatrixChildrenWrapperProps> = ({ question, matrixType }) => {
  const { currentEditingElement, setCurrentEditingElement } = useCreation();
  const { selectAllTextInput } = useGlobal();
  const { t } = useTranslation(FORMULAIRE);
  const [newChildTitle, setNewChildTitle] = useState<string>("");
  const inputRefs = useRef<Record<string | number, HTMLInputElement | null>>({});
  const newChildRefName = "newChild";

  const { handleDeleteChild, handleNewChild, handleSortClick, handleSwapClick, updateChild, children } =
    useMatrixChildrenActions(question, matrixType, setCurrentEditingElement);

  const sortedChildren = useMemo(() => {
    return [...children].sort((a, b) => compareChildren(a, b));
  }, [children]);

  if (!question.children) {
    return null;
  }

  const handleKeyDownExistingChild = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (isShiftEnterPressed(e)) {
      updateChild(index, (e.target as HTMLInputElement).value);
      const targetIndex = index - 1 >= 0 ? index - 1 : 0;
      const targetChild = children[targetIndex];
      if (!targetChild.stableId) return;
      inputRefs.current[targetChild.stableId]?.focus();
    } else if (isEnterPressed(e)) {
      updateChild(index, (e.target as HTMLInputElement).value);
      const targetChildStableId = children[index + 1] ? children[index + 1].stableId : newChildRefName;
      if (!targetChildStableId) return;
      inputRefs.current[targetChildStableId]?.focus();
    }
  };

  const handleKeyDownNewChild = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isShiftEnterPressed(e)) {
      const targetIndex = children.length - 1 >= 0 ? children.length - 1 : 0;
      const targetChoice = children[targetIndex];
      if (!targetChoice.stableId) return;
      inputRefs.current[targetChoice.stableId]?.focus();
    } else if (isEnterPressed(e)) {
      handleNewChild(newChildTitle);
      setNewChildTitle("");
    }
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
            {sortedChildren.map((child, index) => (
              <EditableChildrenRow
                key={child.stableId}
                child={child}
                index={index}
                children={children}
                question={question}
                inputRefs={inputRefs}
                selectAllTextInput={selectAllTextInput}
                updateChild={updateChild}
                handleDeleteChild={handleDeleteChild}
                handleSwapClick={handleSwapClick}
                handleKeyDownExistingChild={handleKeyDownExistingChild}
              />
            ))}
            <NewChoiceWrapper key="newChoice" hasImage={false}>
              <CreationQuestionChoice index={children.length}>
                <TextField
                  inputRef={(el: HTMLInputElement | null) => (inputRefs.current[newChildRefName] = el)}
                  value={newChildTitle}
                  variant={ComponentVariant.STANDARD}
                  placeholder={t("formulaire.matrix.line.label.default", { 0: "" })}
                  fullWidth
                  onFocus={selectAllTextInput}
                  onBlur={() => {
                    handleNewChild(newChildTitle);
                    setNewChildTitle("");
                  }}
                  onChange={(e) => {
                    setNewChildTitle(e.target.value);
                  }}
                  onKeyDown={handleKeyDownNewChild}
                  sx={newChoiceInputStyle}
                />
              </CreationQuestionChoice>
            </NewChoiceWrapper>
          </Box>
        </Box>
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
