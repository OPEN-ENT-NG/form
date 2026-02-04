import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { Box, IconButton, TextField } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { CreationQuestionChoice } from "~/components/CreationQuestionTypes/CreationQuestionChoice";
import { UpDownButtons } from "~/components/UpDownButtons";
import { iconStyle } from "~/components/UpDownButtons/style";
import {
  choiceInputStyle,
  choiceWrapperStyle,
  deleteButtonIconStyle,
  deleteWrapperStyle,
  upDownButtonsWrapperStyle,
} from "~/containers/CreationQuestionChoiceWrapper/style";
import { ComponentSize, ComponentVariant } from "~/core/style/themeProps";
import { IEditableChildrenRowProps } from "./types";

export const EditableChildrenRow: FC<IEditableChildrenRowProps> = ({
  child,
  index,
  children,
  question,
  inputRefs,
  selectAllTextInput,
  updateChild,
  handleDeleteChild,
  handleSwapClick,
  handleKeyDownExistingChild,
}) => {
  const [title, setTitle] = useState(child.title);

  const getRealIndex = (stableId: string) => children.findIndex((c) => c.stableId === stableId);

  const updateChildrenById = (stableId: string, value: string) => {
    const realIndex = getRealIndex(stableId);
    if (realIndex !== -1) {
      updateChild(realIndex, value);
    }
  };

  const deleteChildrenById = (stableId: string) => {
    const realIndex = getRealIndex(stableId);
    if (realIndex !== -1) {
      void handleDeleteChild(children[realIndex].id, realIndex, children[realIndex].matrixPosition);
    }
  };

  // 🔑 resync si tri / suppression / undo
  useEffect(() => {
    setTitle(child.title);
  }, [child.title]);

  return (
    <Box sx={choiceWrapperStyle}>
      <Box sx={upDownButtonsWrapperStyle}>
        <UpDownButtons
          element={child}
          index={index}
          elementList={children}
          hasCustomAtTheEnd={false}
          handleReorderClick={handleSwapClick}
        />
      </Box>

      <CreationQuestionChoice index={index} type={question.questionType} isEditing>
        <TextField
          inputRef={(el: HTMLInputElement | null) => {
            if (!child.stableId) return;
            inputRefs.current[child.stableId] = el;
          }}
          value={title}
          variant={ComponentVariant.STANDARD}
          fullWidth
          onFocus={selectAllTextInput}
          onChange={(e) => {
            setTitle(e.target.value);
            updateChildrenById(child.stableId?.toString() ?? "", e.target.value);
          }}
          onKeyDown={(e) => {
            handleKeyDownExistingChild(e, index);
          }}
          sx={choiceInputStyle}
        />
      </CreationQuestionChoice>

      <Box sx={deleteWrapperStyle}>
        {children.length > 1 && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              deleteChildrenById(child.stableId?.toString() ?? "");
            }}
            size={ComponentSize.SMALL}
            sx={deleteButtonIconStyle}
          >
            <ClearRoundedIcon sx={iconStyle} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
