import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Typography } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { MediaLibrary, MediaLibraryRef } from "@edifice.io/react/multimedia";
import { useEdificeClient, useWorkspaceFile } from "@edifice.io/react";
import { createPortal } from "react-dom";
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
  mediaLibraryStyle,
} from "./style";
import { IImagePickerMediaLibraryProps, MediaLibraryResult } from "./types";
import { BoxComponentType } from "~/core/style/themeProps";
import { useDropzone } from "react-dropzone";
import {
  FORMULAIRE,
  GIF_EXTENSION,
  JPEG_EXTENSION,
  JPG_EXTENSION,
  PNG_EXTENSION,
  PROTECTED_VISIBILITY,
  SVG_EXTENSION,
} from "~/core/constants";

export const ImagePickerMediaLibrary: FC<IImagePickerMediaLibraryProps> = ({
  information,
  onImageChange = () => {},
  width = "160px",
  height = "160px",
  initialSrc = null,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(initialSrc);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const mediaLibraryRef = useRef<MediaLibraryRef>(null);
  const { appCode } = useEdificeClient();
  const { create } = useWorkspaceFile();

  const handleDropFiles = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const newWorkspaceElement: MediaLibraryResult = await create(file, {
      visibility: PROTECTED_VISIBILITY,
      application: FORMULAIRE,
    });
    handleMediaLibrarySuccess(newWorkspaceElement);
  };

  const handleDropFilesWrapper = (acceptedFiles: File[]) => {
    void handleDropFiles(acceptedFiles);
  };

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: handleDropFilesWrapper,
    multiple: false,
    accept: { IMAGE_CONTENT_TYPE: [PNG_EXTENSION, JPEG_EXTENSION, JPG_EXTENSION, GIF_EXTENSION, SVG_EXTENSION] },
  });

  useEffect(() => {
    const element = document.getElementById("portal");
    if (element) {
      setPortalElement(element);
      return;
    }
    const newPortalElement = document.createElement("div");
    newPortalElement.id = "portal";
    document.body.appendChild(newPortalElement);
    setPortalElement(newPortalElement);
  }, []);

  useEffect(() => {
    setCurrentSrc(initialSrc);
  }, [initialSrc]);

  const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setCurrentSrc(null);
    onImageChange(null);
  };

  const handleEdit = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    openMediaLibrary();
  };

  const openMediaLibrary = () => {
    setIsMediaLibraryOpen(true);
    setTimeout(() => {
      mediaLibraryRef.current?.show("image");
    }, 0);
  };

  const closeMediaLibrary = () => {
    mediaLibraryRef.current?.hide();
    setIsMediaLibraryOpen(false);
  };

  const handleMediaLibrarySuccess = (result: MediaLibraryResult) => {
    const mediaItem: MediaLibraryResult = Array.isArray(result) ? result[0] : result;
    const fileId: string = mediaItem._id ?? "";

    if (fileId) {
      const src = `/workspace/document/${fileId}`;
      setCurrentSrc(src);
      onImageChange(src);
      closeMediaLibrary();
    }
  };

  return (
    <Box {...getRootProps()}>
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
              {isDragActive ? (
                <Typography sx={labelTextStyle}>
                  <Box component={BoxComponentType.SPAN} fontWeight="bold">
                    Glissez
                  </Box>{" "}
                  une image
                </Typography>
              ) : (
                <Typography sx={labelTextStyle}>
                  <Box component={BoxComponentType.SPAN} fontWeight="bold">
                    Glissez-déposez
                  </Box>{" "}
                  ou{" "}
                  <Box component={BoxComponentType.SPAN} fontWeight="bold">
                    cliquez
                  </Box>{" "}
                  pour choisir une image
                </Typography>
              )}
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
      </Box>
      {isMediaLibraryOpen &&
        portalElement &&
        createPortal(
          <Box id="media-library-form" sx={mediaLibraryStyle}>
            <MediaLibrary
              ref={mediaLibraryRef}
              onCancel={() => {
                closeMediaLibrary();
              }}
              onSuccess={handleMediaLibrarySuccess}
              appCode={appCode}
              multiple={false}
              visibility={PROTECTED_VISIBILITY}
            />
          </Box>,
          portalElement,
        )}
    </Box>
  );
};
