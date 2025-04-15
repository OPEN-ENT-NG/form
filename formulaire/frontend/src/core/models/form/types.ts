export interface IForm {
  id: number;
  title: string;
  description: string | null;
  picture: string | null;
  owner_id: string;
  owner_name: string;
  date_creation: Date;
  date_modification: Date;
  date_opening: Date | null;
  date_ending: Date | null;
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
  is_progress_bar_displayed: boolean;
  rgpd: boolean;
  rgpd_goal: string | null;
  rgpd_lifetime: number;
  folder_id: number;
  nb_elements: number;
  nb_responses: number | null;
  infoImg: IInfoImg;
  rights: string[];
}

export interface IInfoImg {
  name: string;
  type: string;
  compatible: boolean;
}

export interface IFormPayload {
  anonymous: boolean;
  archived: boolean;
  collab: boolean;
  date_creation: Date | null;
  date_ending: string | null;
  date_modification: Date | null;
  date_opening: string;
  description: string | null;
  displayed: boolean;
  editable: boolean;
  folder_id: number;
  id: number | null;
  is_public: boolean;
  multiple: boolean;
  nb_responses: number | null;
  owner_id: string | null;
  owner_name: string | null;
  picture: string | null;
  public_key: string | null;
  reminded: boolean;
  response_notified: boolean;
  rgpd: boolean;
  rgpd_goal: string | null;
  rgpd_lifetime: number;
  selected: null;
  sent: boolean;
  title: string;
  is_progress_bar_displayed: boolean;
}

export interface IDuplicateFormPayload {
  formIds: number[];
  folderId: number;
}

export interface IFormRight {
  resource_id: number;
  action: string;
}
export interface IFormReminderPayload {
  formId: string;
  mail: { link: string; subject: string; body: string };
}
