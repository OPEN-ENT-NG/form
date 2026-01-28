import { IDistribution } from "~/core/models/distribution/types";
import { getFirstDistributionDate } from "~/core/models/distribution/utils";
import { IForm } from "~/core/models/form/types";
import { getFormDistributions, isFormFilled } from "~/core/models/form/utils";

import { ChipsID, MenuItemsID, MenuItemState } from "../../components/OrganizeFilter/enum";
import { IFormChipProps, IMenuItemProps } from "../../components/OrganizeFilter/types";

export const sentFormsChipDatas: IFormChipProps[] = [
  {
    id: ChipsID.TODO,
    i18nKey: "formulaire.filter.to_do",
    filterFn: (form: IForm, distributions?: IDistribution[]) => !isFormFilled(form, distributions ?? []),
  },
  {
    id: ChipsID.FINISHED,
    i18nKey: "formulaire.filter.finished",
    filterFn: (form: IForm, distributions?: IDistribution[]) => isFormFilled(form, distributions ?? []),
  },
];

export const sentFormMenuItemDatas: IMenuItemProps[] = [
  {
    id: MenuItemsID.CREATION,
    i18nKey: "formulaire.filter.sending_date",
    state: MenuItemState.DESCENDING,
    sortFn: (a: IForm, b: IForm, isAscending: boolean, distributions?: IDistribution[]) => {
      const direction = isAscending ? 1 : -1;
      if (!distributions) return 0;
      const aSendingDate = getFirstDistributionDate(getFormDistributions(a, distributions));
      const bSendingDate = getFirstDistributionDate(getFormDistributions(b, distributions));
      return direction * (new Date(aSendingDate).getTime() - new Date(bSendingDate).getTime());
    },
  },
  {
    id: MenuItemsID.TITLE,
    i18nKey: "formulaire.filter.title",
    state: MenuItemState.DESCENDING,
    sortFn: (a: IForm, b: IForm, isAscending: boolean) => {
      const direction = isAscending ? 1 : -1;
      return direction * a.title.localeCompare(b.title);
    },
  },
];
