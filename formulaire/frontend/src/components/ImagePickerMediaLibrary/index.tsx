import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Typography } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { MediaLibrary, MediaLibraryRef, MediaLibraryResult } from "@edifice.io/react/multimedia";
import { useEdificeClient } from "@edifice.io/react";
import {
  containerStyle,
  imagePickerContainerStyle,
  emptyStateContentStyle,
  iconStyle,
  labelTextStyle,
  infoTextStyle,
  actionsContainerStyle,
  actionButtonStyle,
  imageStyle,
} from "./style";
import { ImagePickerMediaLibraryProps } from "./types";

export const ImagePickerMediaLibrary: FC<ImagePickerMediaLibraryProps> = ({
  information,
  onImageChange = (src: string | null) => {},
  width = "160px",
  height = "160px",
  initialSrc = null,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(initialSrc);
  const mediaLibraryRef = useRef<MediaLibraryRef>(null);
  const { appCode } = useEdificeClient();

  useEffect(() => {
    setCurrentSrc(initialSrc);
  }, [initialSrc]);

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setCurrentSrc(null);
    onImageChange(null);
  };

  const handleEdit = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    openMediaLibrary();
  };

  const openMediaLibrary = () => {
    mediaLibraryRef.current?.show("image");
  };

  const closeMediaLibrary = () => {
    mediaLibraryRef.current?.hide();
  };

  const handleMediaLibrarySuccess = (result: MediaLibraryResult) => {
    console.log(result);

    const mediaItem = Array.isArray(result) ? result[0] : result;
    const fileId = mediaItem?._id;

    if (fileId) {
      const src = `/workspace/document/${fileId}`;
      setCurrentSrc(src);
      onImageChange(src);
      closeMediaLibrary();
    }
  };

  return (
    <Box sx={containerStyle} className="media-library-image-picker">
      <Box
        sx={{
          ...imagePickerContainerStyle(currentSrc),
          width,
          height,
        }}
        onClick={openMediaLibrary}
      >
        {!currentSrc ? (
          <Box sx={emptyStateContentStyle}>
            <AddPhotoAlternateIcon color="primary" sx={iconStyle} />
            <Typography sx={labelTextStyle}>
              <Box component="span" fontWeight="bold">
                Glissez-déposez
              </Box>{" "}
              ou{" "}
              <Box component="span" fontWeight="bold">
                cliquez
              </Box>{" "}
              pour choisir une image
            </Typography>
            {information && <Typography sx={infoTextStyle}>{information}</Typography>}
          </Box>
        ) : (
          <>
            <Box sx={actionsContainerStyle}>
              <Box onClick={handleEdit} sx={actionButtonStyle}>
                <CreateIcon fontSize="small" />
              </Box>
              <Box onClick={handleDelete} sx={actionButtonStyle}>
                <DeleteIcon fontSize="small" />
              </Box>
            </Box>
            <img src={currentSrc} alt="Selected media" style={imageStyle} />
          </>
        )}
      </Box>
      <Box id="media-library-form">
        <MediaLibrary
          ref={mediaLibraryRef}
          onCancel={() => mediaLibraryRef.current?.hide()}
          onSuccess={handleMediaLibrarySuccess}
          appCode={appCode}
          multiple={false}
          visibility="protected"
        />
      </Box>
    </Box>
  );
};
