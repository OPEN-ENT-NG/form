import { Box, Dropzone, FileList, Typography } from "@cgi-learning-hub/ui";
import { FC, useMemo } from "react";

import { MAX_FILES_SAVE } from "~/core/constants";
import { IResponseFile } from "~/core/models/response/type";
import { t } from "~/i18n";
import { useResponse } from "~/providers/ResponseProvider";

import { IRespondQuestionTypesProps } from "../types";
import { ICustomFile } from "./types";
import { toCustomFile, toResponseFile } from "./utils";

export const RespondQuestionFile: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponse, updateQuestionResponses, isPageTypeRecap } = useResponse();

  const files = useMemo<ICustomFile[]>(() => {
    const associatedResponse = getQuestionResponse(question);
    return associatedResponse?.files.map((file) => toCustomFile(file, !isPageTypeRecap)) ?? [];
  }, [question, getQuestionResponse]);

  const handleOnDrop = (acceptedFiles: File[]) => {
    const associatedResponse = getQuestionResponse(question);
    const prevFiles: IResponseFile[] = associatedResponse?.files ?? [];
    const uploadedFiles: IResponseFile[] = acceptedFiles.map((file) => toResponseFile(file));
    const newFiles: IResponseFile[] = [...prevFiles, ...uploadedFiles];

    if (!associatedResponse) return;
    updateQuestionResponses(question, [
      { ...associatedResponse, files: newFiles, answer: t("formulaire.response.file.send") },
    ]);
  };

  const handleDeleteFile = (file: ICustomFile) => {
    const associatedResponse = getQuestionResponse(question);
    const prevFiles: IResponseFile[] = associatedResponse?.files ?? [];
    const newFiles: IResponseFile[] = prevFiles.filter((f) => f.id !== file.id);

    if (!associatedResponse) return;
    updateQuestionResponses(question, [
      { ...associatedResponse, files: newFiles.slice(0, MAX_FILES_SAVE), answer: t("formulaire.response.file.send") },
    ]);
  };

  return (
    <Box>
      {isPageTypeRecap && !files.length ? (
        <Typography fontStyle={"italic"}>{t("formulaire.response.missing")}</Typography>
      ) : (
        <FileList files={files} onDelete={handleDeleteFile} />
      )}
      {!isPageTypeRecap && (
        <Dropzone
          disabled={files.length >= MAX_FILES_SAVE}
          width="100%"
          height="16rem"
          maxFiles={MAX_FILES_SAVE}
          information={t("formulaire.max.files", { 0: MAX_FILES_SAVE })}
          onDrop={handleOnDrop}
        />
      )}
    </Box>
  );
};
