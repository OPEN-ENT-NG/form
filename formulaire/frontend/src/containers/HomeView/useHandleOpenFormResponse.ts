import { DistributionStatus } from "~/core/models/distribution/enums";
import { IDistribution } from "~/core/models/distribution/types";
import { IForm } from "~/core/models/form/types";
import { getRgpdPath, getRespondFormPath, getRecapFormPath } from "~/core/pathHelper";
import { useAddDistributionMutation } from "~/services/api/services/formulaireApi/distributionApi";

export const useHandleOpenFormResponse = () => {
  const [addDistribution] = useAddDistributionMutation();

  const handleSingleResponse = (form: IForm, distrib?: IDistribution): string | undefined => {
    if (!distrib) return undefined;

    return distrib.status === DistributionStatus.TO_DO
      ? form.rgpd
        ? getRgpdPath(form.id)
        : getRespondFormPath(form.id, distrib.id)
      : getRecapFormPath(form.id, distrib.id);
  };

  const handleMultipleResponse = async (form: IForm, distribs: IDistribution[]): Promise<string | undefined> => {
    if (form.rgpd) return getRgpdPath(form.id);

    const todoDistrib = distribs.find((d) => d.status === DistributionStatus.TO_DO);
    if (todoDistrib) return getRespondFormPath(form.id, todoDistrib.id);

    if (distribs.length === 0) return undefined;

    try {
      const newDistrib = await addDistribution(distribs[0].id).unwrap();
      return getRespondFormPath(form.id, newDistrib.id);
    } catch (error) {
      console.error("create.distrib.error", error);
      return undefined;
    }
  };

  return async (form: IForm, userDistributions: IDistribution[]): Promise<string | undefined> => {
    const formDistribs = userDistributions.filter((d) => d.formId === form.id);

    return form.multiple ? handleMultipleResponse(form, formDistribs) : handleSingleResponse(form, formDistribs[0]);
  };
};
