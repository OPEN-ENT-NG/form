export interface Form {
  id: number;
  title: string;
  description: string;
  picture: string;
  owner_id: string;
  owner_name: string;
  date_creation: Date;
  date_modification: Date;
  date_opening: Date;
  date_ending: Date;
  sent: boolean;
  collab: boolean;
  reminded: boolean;
  archived: boolean;
  multiple: boolean;
  anonymous: boolean;
  is_public: boolean;
  public_key: string;
  response_notified: boolean;
  editable: boolean;
  displayed: boolean;
  rgpd: boolean;
  rgpd_goal: string;
  rgpd_lifetime: number;
  folder_id: number;
  nb_elements: number;
  nb_responses: number;
  infoImg: InfoImg;
}

export interface InfoImg {
  name: string;
  type: string;
  compatible: boolean;
}

export interface FormPayload {
  anonymous: boolean;
  archived: boolean;
  collab: boolean;
  date_creation: null;
  date_ending: string | null;
  date_modification: null;
  date_opening: string;
  description: string | null;
  displayed: boolean;
  editable: boolean;
  folder_id: number;
  id: number | null;
  is_public: boolean;
  multiple: boolean;
  nb_responses: number;
  owner_id: number | null;
  owner_name: string | null;
  picture: string | null;
  public_key: string | null;
  reminded: boolean;
  response_notified: boolean;
  rgpd: boolean;
  rgpd_goal: string | null;
  rgpd_lifetime: number;
  selected: unknown | null;
  sent: boolean;
  title: string;
  isProgressBarDisplayed: boolean;
}

export interface DuplicateFormPayload {
  formIds: number[];
  folderId: number;
}
