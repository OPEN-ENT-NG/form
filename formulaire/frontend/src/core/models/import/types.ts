export interface ImportUploadResponse {
  importId: string;
}

export interface ImportAnalyseResponseApp {
  formulaire: {
    folder: string;
    size: number;
  };
}

export interface ImportAnalyzeResponse {
  importId: string;
  apps: ImportAnalyseResponseApp[];
  quota: number;
}

export interface ImportLaunchResponse {
  formulaire: {
    status: string;
    resourcesNumber: string;
    errorsNumber: string;
    duplicatesNumber: string;
    mainResourceName: string;
  };
}
