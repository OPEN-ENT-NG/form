import { Box, Dropzone, FileList } from "@cgi-learning-hub/ui";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, MAX_FILES_SAVE } from "~/core/constants";
import { IResponseFile } from "~/core/models/response/type";
import { useResponse } from "~/providers/ResponseProvider";
import { IRespondQuestionTypesProps } from "../types";
import { ICustomFile } from "./types";
import { createResponse, toCustomFile, toResponseFile } from "./utils";

export const RespondQuestionFile: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponse, updateQuestionResponses } = useResponse();
  const { t } = useTranslation(FORMULAIRE);

  const files = useMemo<ICustomFile[]>(() => {
    const associatedResponse = getQuestionResponse(question);
    return associatedResponse?.files.map((file) => toCustomFile(file)) ?? [];
  }, [question, getQuestionResponse]);

  const handleOnDrop = (acceptedFiles: File[]) => {
    const associatedResponse = getQuestionResponse(question);
    const prevFiles: IResponseFile[] = associatedResponse?.files ?? [];
    const uploadedFiles: IResponseFile[] = acceptedFiles.map((file) => toResponseFile(file));
    const newFiles: IResponseFile[] = [...prevFiles, ...uploadedFiles];

    updateQuestionResponses(question, [createResponse(question, newFiles.slice(0, MAX_FILES_SAVE))]);
  };

  const handleDeleteFile = (file: ICustomFile) => {
    const associatedResponse = getQuestionResponse(question);
    const prevFiles: IResponseFile[] = associatedResponse?.files ?? [];
    const newFiles: IResponseFile[] = prevFiles.filter((f) => f.id !== file.id);

    updateQuestionResponses(question, [createResponse(question, newFiles.slice(0, MAX_FILES_SAVE))]);
  };

  return (
    <Box>
      <FileList files={files} onDelete={handleDeleteFile} />
      <Dropzone
        disabled={files.length >= MAX_FILES_SAVE}
        width="100%"
        height="16rem"
        maxFiles={MAX_FILES_SAVE}
        information={t("formulaire.max.files", { 0: MAX_FILES_SAVE })}
        onDrop={handleOnDrop}
      />
    </Box>
  );
};
