import { IPdfImagesPayload, IUploadedFileResponse } from "~/core/models/response/type";

export const buildImagesPayload = (files: IUploadedFileResponse[]): IPdfImagesPayload => {
  const images: IPdfImagesPayload = {
    idImagesPerQuestion: {},
    idImagesForRemove: [],
  };

  files.forEach((file) => {
    const fileId = file.id;
    const questionId = file.metadata.name.split("-")[2];

    images.idImagesPerQuestion[questionId] = fileId;
    images.idImagesForRemove.push(fileId);
  });

  return images;
};
