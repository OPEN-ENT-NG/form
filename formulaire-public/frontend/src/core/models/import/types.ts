export interface IImportUploadResponse {
  importId: string;
}

export interface IImportAnalyseResponseApp {
  formulaire: {
    folder: string;
    size: number;
  };
}

export interface IImportAnalyzeResponse {
  importId: string;
  apps: IImportAnalyseResponseApp[];
  quota: number;
}

export interface IImportLaunchResponse {
  formulaire: {
    status: string;
    resourcesNumber: string;
    errorsNumber: string;
    duplicatesNumber: string;
    mainResourceName: string;
  };
}
