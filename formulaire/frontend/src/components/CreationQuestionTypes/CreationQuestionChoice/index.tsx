import { FC, ReactNode, useCallback, useState } from "react";
import { Box, IconButton, Typography } from "@cgi-learning-hub/ui";
import { IMAGE_PICKER_INFO } from "~/core/constants";
import { ICreationQuestionChoiceProps } from "./types";
import { CreationQuestionChoiceType } from "./enum";
import { ImagePickerMediaLibrary } from "~/components/ImagePickerMediaLibrary";
import {
  choiceIconStyle,
  choiceInputStyle,
  deleteIconStyle,
  imageIconStyle,
  mediaLibraryWrapperStyle,
  questionChoiceWrapperStyle,
} from "./style";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import { ComponentSize } from "~/core/style/themeProps";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";

export const CreationQuestionChoice: FC<ICreationQuestionChoiceProps> = ({
  type,
  children,
  index,
  isEditing = false,
  hasImage = false,
  updateChoiceImage,
  image = "",
}) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(!!image);

  const handleImageChange = useCallback(
    (src: string | null) => {
      if (!updateChoiceImage) return;
      updateChoiceImage(index, src || "");
    },
    [updateChoiceImage, index],
  );

  const typeToIcons: Record<CreationQuestionChoiceType, ReactNode> = {
    [CreationQuestionChoiceType.SINGLE_ANSWER_RADIO]: <RadioButtonUncheckedRoundedIcon sx={choiceIconStyle} />,
    [CreationQuestionChoiceType.MULTIPLE_ANSWER]: <CheckBoxOutlineBlankRoundedIcon sx={choiceIconStyle} />,
    [CreationQuestionChoiceType.SINGLE_ANSWER]: <Typography sx={choiceIconStyle}>{`${index + 1}.`}</Typography>,
  };

  return (
    <Box sx={questionChoiceWrapperStyle}>
      <Box sx={choiceInputStyle}>
        {typeToIcons[type]}
        {children}
        {hasImage && (
          <IconButton
            onClick={() => {
              setShowMediaLibrary(true);
            }}
            sx={imageIconStyle}
          >
            <ImageRoundedIcon />
          </IconButton>
        )}
      </Box>
      {showMediaLibrary && (
        <Box sx={mediaLibraryWrapperStyle}>
          <ImagePickerMediaLibrary
            width="16rem"
            height="16.3rem"
            information={IMAGE_PICKER_INFO}
            onImageChange={handleImageChange}
            initialSrc={image}
          />
          {isEditing && (
            <IconButton
              onClick={() => {
                setShowMediaLibrary(false);
                handleImageChange(null);
              }}
              size={ComponentSize.SMALL}
              sx={deleteIconStyle}
            >
              <ClearRoundedIcon />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};
