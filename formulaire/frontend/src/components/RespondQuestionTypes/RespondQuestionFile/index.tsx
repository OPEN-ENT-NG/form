import { Box, Dropzone, FileList, Typography } from "@cgi-learning-hub/ui";
import { FC, useMemo } from "react";

import { MAX_FILES_SAVE } from "~/core/constants";
import { ResponsePageType } from "~/core/enums";
import { IResponseFile } from "~/core/models/response/type";
import { t } from "~/i18n";
import { useResponse } from "~/providers/ResponseProvider";

import { IRespondQuestionTypesProps } from "../types";
import { ICustomFile } from "./types";
import { createResponse, toCustomFile, toResponseFile } from "./utils";

export const RespondQuestionFile: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponse, updateQuestionResponses, pageType } = useResponse();
  const isPageTypeRecap = pageType === ResponsePageType.RECAP;

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
      {isPageTypeRecap && !files.length ? (
        <Typography fontStyle={"italic"}>{t("formulaire.response.missing")}</Typography>
      ) : (
        <FileList files={files} {...(!isPageTypeRecap && { onDelete: handleDeleteFile })} />
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
