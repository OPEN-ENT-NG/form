import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { Box, IconButton, TextField } from "@mui/material";
import { FC, useEffect, useState } from "react";

import { CreationQuestionChoiceConditional } from "~/components/CreationQuestionChoiceConditional";
import { CreationQuestionChoice } from "~/components/CreationQuestionTypes/CreationQuestionChoice";
import { UpDownButtons } from "~/components/UpDownButtons";
import { iconStyle } from "~/components/UpDownButtons/style";
import { hasFormResponses } from "~/core/models/form/utils";
import { IQuestionChoice } from "~/core/models/question/types";
import { ComponentSize, ComponentVariant } from "~/core/style/themeProps";
import { useCreation } from "~/providers/CreationProvider";

import {
  choiceInputStyle,
  choiceWrapperStyle,
  deleteButtonIconStyle,
  deleteWrapperStyle,
  upDownButtonsWrapperStyle,
} from "../style";
import { hasImageType } from "../utils";
import { IEditableChoiceRowProps } from "./types";

export const EditableChoiceRow: FC<IEditableChoiceRowProps> = ({
  choice,
  index,
  choices,
  customChoice,
  type,
  question,
  inputRefs,
  updateChoice,
  updateChoiceImage,
  updateChoiceNextFormElement,
  handleDeleteChoice,
  handleSwapClick,
  handleKeyDownExistingChoice,
  selectAllTextInput,
}) => {
  const [choiceValue, setChoiceValue] = useState(choice.value);
  const { form } = useCreation();

  useEffect(() => {
    setChoiceValue(choice.value);
  }, [choice.value]);

  const getRealIndex = (stableId: string) => choices.findIndex((c) => c.stableId?.toString() === stableId);

  const updateChoiceById = (stableId: string, value: string) => {
    const realIndex = getRealIndex(stableId);
    if (realIndex !== -1) {
      updateChoice(realIndex, value);
    }
  };

  const deleteChoiceById = (choice: IQuestionChoice) => {
    const realIndex = getRealIndex(choice.stableId?.toString() ?? "");
    if (realIndex !== -1) {
      void handleDeleteChoice(choice.id, realIndex, choice.position);
    }
  };

  return (
    <Box sx={choiceWrapperStyle}>
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
        isEditing
      >
        <TextField
          inputRef={(el: HTMLInputElement | null) => {
            if (!choice.stableId) return;
            inputRefs.current[choice.stableId] = el;
          }}
          value={choiceValue}
          variant={ComponentVariant.STANDARD}
          fullWidth
          onFocus={selectAllTextInput}
          onChange={(e) => {
            setChoiceValue(e.target.value);
            updateChoiceById(choice.stableId?.toString() ?? "", e.target.value);
          }}
          onKeyDown={(e) => {
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
              deleteChoiceById(choice);
            }}
            size={ComponentSize.SMALL}
            sx={deleteButtonIconStyle}
            disabled={!form || hasFormResponses(form)}
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
  );
};
