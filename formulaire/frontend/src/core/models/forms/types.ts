export interface Selectable {
  selected: boolean | null;
}

export interface Form extends Selectable {
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
