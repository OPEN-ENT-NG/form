import { Button } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { ComponentVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";

import { IDownloadFilesZipProps } from "./types";

export const DownloadFilesZip: FC<IDownloadFilesZipProps> = ({ questionId }) => {
  const handleDownloadFilesZip = () => window.open(`/formulaire/responses/${questionId}/files/download/zip`, "_blank");

  return (
    <Button variant={ComponentVariant.CONTAINED} onClick={handleDownloadFilesZip}>
      {t("formulaire.form.download.all.files")}
    </Button>
  );
};
