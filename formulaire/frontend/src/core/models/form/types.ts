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
}
