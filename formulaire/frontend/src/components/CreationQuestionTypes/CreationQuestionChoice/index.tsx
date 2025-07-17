import { FC, useCallback, useState } from "react";
import { Box, IconButton, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, IMAGE_PICKER_INFO } from "~/core/constants";
import { ICreationQuestionChoiceProps } from "./types";
import { CreationQuestionChoiceType } from "./enum";
import { ImagePickerMediaLibrary } from "~/components/ImagePickerMediaLibrary";
import { choiceIconStyle, deleteIconStyle, mediaLibraryWrapperStyle, questionChoiceWrapperStyle } from "./style";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import { ComponentSize } from "~/core/style/themeProps";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

export const CreationQuestionChoice: FC<ICreationQuestionChoiceProps> = ({
  type,
  children,
  index,
  isEditing = false,
  hasImage = false,
  updateChoiceImage,
  image = "",
}) => {
  const { t } = useTranslation(FORMULAIRE);
  const [showMediaLibrary, setShowMediaLibrary] = useState(!!image);

  const handleImageChange = useCallback((src: string | null) => {
    if (!updateChoiceImage) return;
    updateChoiceImage(index, src || "");
  }, []);

  const typeToIcons: Record<CreationQuestionChoiceType, string> = {
    [CreationQuestionChoiceType.SINGLE_CHOICE]: "●",
    [CreationQuestionChoiceType.MULTIPLE_CHOICE]: "▼",
    [CreationQuestionChoiceType.DROPDOWN]: `${index + 1}.`,
  };

  console.log(showMediaLibrary, image);

  return (
    <Box sx={questionChoiceWrapperStyle}>
      <Box sx={{ display: "flex", width: "100%", marginRight: 1 }}>
        <Typography sx={choiceIconStyle}>{typeToIcons[type]}</Typography>
        {children}
        {hasImage && (
          <IconButton
            onClick={() => {
              setShowMediaLibrary(true);
            }}
            sx={{
              color: "primary.main",
            }}
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
