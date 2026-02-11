import { useNavigate } from "react-router-dom";

import { DistributionStatus } from "~/core/models/distribution/enums";
import { IDistribution } from "~/core/models/distribution/types";
import { IForm } from "~/core/models/form/types";
import { getHrefRecapFormPath } from "~/core/pathHelper";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { useAddDistributionMutation } from "~/services/api/services/formulaireApi/distributionApi";

export const useHandleOpenFormResponse = () => {
  const [addDistribution] = useAddDistributionMutation();
  const { navigateToFormResponse } = useFormulaireNavigation();
  const navigate = useNavigate();

  const handleSingleResponse = (form: IForm, distrib?: IDistribution): void => {
    if (!distrib) return;

    if (distrib.status === DistributionStatus.TO_DO) {
      navigateToFormResponse(form.id, distrib.id);
    } else {
      navigate(getHrefRecapFormPath(form.id, distrib.id));
    }
  };

  const handleMultipleResponse = async (form: IForm, distribs: IDistribution[]): Promise<void> => {
    const todoDistrib = distribs.find((d) => d.status === DistributionStatus.TO_DO);
    if (todoDistrib) {
      navigateToFormResponse(form.id, todoDistrib.id);
      return;
    }

    if (distribs.length === 0) return undefined;

    try {
      const newDistrib = await addDistribution(distribs[0].id).unwrap();
      navigateToFormResponse(form.id, newDistrib.id);
      return;
    } catch (error) {
      console.error("create.distrib.error", error);
      return undefined;
    }
  };

  return async (form: IForm, userDistributions: IDistribution[]): Promise<void> => {
    const formDistribs = userDistributions.filter((d) => d.formId === form.id);

    if (form.multiple) {
      await handleMultipleResponse(form, formDistribs);
    } else {
      handleSingleResponse(form, formDistribs[0]);
    }
  };
};
