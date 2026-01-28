import { Box, Checkbox, IconButton, Radio, Typography } from "@cgi-learning-hub/ui";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import { FC, ReactNode, useCallback, useState } from "react";

import { ImagePickerMediaLibrary } from "~/components/ImagePickerMediaLibrary";
import { IMAGE_PICKER_INFO } from "~/core/constants";
import { QuestionTypes } from "~/core/models/question/enum";
import { ComponentSize } from "~/core/style/themeProps";

import {
  choiceIconStyle,
  choiceInputStyle,
  deleteIconStyle,
  imageIconStyle,
  mediaLibraryWrapperStyle,
  questionChoiceWrapperStyle,
} from "./style";
import { ICreationQuestionChoiceProps } from "./types";

export const CreationQuestionChoice: FC<ICreationQuestionChoiceProps> = ({
  children,
  index,
  type = "",
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

  const typeToIcons: Partial<Record<QuestionTypes | string, ReactNode>> = {
    [QuestionTypes.SINGLEANSWERRADIO]: <Radio sx={choiceIconStyle} disabled={true} />,
    [QuestionTypes.MULTIPLEANSWER]: <Checkbox sx={choiceIconStyle} disabled={true} />,
    [QuestionTypes.SINGLEANSWER]: <Typography sx={choiceIconStyle}>{`${index + 1}.`}</Typography>,
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
