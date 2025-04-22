import { DistributionStatus } from "~/core/models/distribution/enums";
import { IDistribution } from "~/core/models/distribution/types";
import { IForm, IInfoImg } from "~/core/models/form/types";

export const makeMockedForm = (id: number): IForm => ({
  id,
  title: `Form #${String(id)}`,
  description: null,
  picture: null,
  owner_id: `owner-${String(id)}`,
  owner_name: `Owner ${String(id)}`,
  date_creation: new Date(2025, 0, id),
  date_modification: new Date(2025, 1, id),
  date_opening: null,
  date_ending: null,
  sent: id === 1,
  collab: id === 2,
  reminded: id === 3,
  archived: false,
  multiple: id === 4,
  anonymous: id === 5,
  is_public: id === 6,
  public_key: `public-key-${String(id)}`,
  response_notified: id === 7,
  editable: true,
  is_progress_bar_displayed: id === 8,
  rgpd: true,
  rgpd_goal: null,
  rgpd_lifetime: 365,
  folder_id: id * 10,
  nb_elements: id * 4,
  nb_responses: null,
  infoImg: {
    name: `Image ${String(id)}`,
    type: id === 8 ? "image/png" : "image/jpeg",
    compatible: id === 9,
  } as IInfoImg,
  rights: [],
});

export const makeMockedDistribution = (id: number): IDistribution => ({
  id,
  formId: id,
  senderId: `sender-${id}`,
  senderName: `Sender ${id}`,
  responderId: `responder-${id}`,
  responderName: `Responder ${id}`,
  // cycle through three statuses for variety
  status: (() => {
    switch (id % 3) {
      case 0:
        return DistributionStatus.TO_DO;
      case 1:
        return DistributionStatus.FINISHED;
      case 2:
        return DistributionStatus.ON_CHANGE;
      default:
        return DistributionStatus.ON_CHANGE;
    }
  })(),
  // even IDs have a sending date, odd ones null
  dateSending: id % 2 === 0 ? new Date(2025, 0, id).toISOString() : null,
  // IDs divisible by 3 have a response date
  dateResponse: id % 3 === 0 ? new Date(2025, 1, id).toISOString() : null,
  // alternate active flag
  active: id % 2 === 1,
  // every 4th gets a structure name
  structure: id % 4 === 0 ? `Structure ${id}` : null,
  // all except the first refer back to a previous originalId
  originalId: id > 1 ? id - 1 : null,
  // every 5th gets a publicKey
  publicKey: id % 5 === 0 ? `public-key-${id}` : null,
  // every 6th gets a captchaId
  captchaId: id % 6 === 0 ? `captcha-${id}` : null,
});
