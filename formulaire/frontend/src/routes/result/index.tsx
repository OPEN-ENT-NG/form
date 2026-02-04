import { Loader } from "@cgi-learning-hub/ui";
import { skipToken } from "@reduxjs/toolkit/query";
import { FC } from "react";
import { useParams } from "react-router-dom";

import { ResultView } from "~/containers/result/ResultView";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { ResultProvider } from "~/providers/ResultProvider";
import { useCountDistributionsQuery } from "~/services/api/services/formulaireApi/distributionApi";
import { useGetFormQuery } from "~/services/api/services/formulaireApi/formApi";

export const Result: FC = () => {
  const { formId } = useParams();
  const { navigateToHome } = useFormulaireNavigation();

  const formIdNumber = formId ? parseInt(formId, 10) : NaN;

  const { data: currentForm, isLoading: isFormLoading } = useGetFormQuery(
    isNaN(formIdNumber) ? skipToken : { formId: formIdNumber.toString() },
  );

  const { data: countDistributions, isLoading: isCountDistributionsLoading } = useCountDistributionsQuery(formIdNumber);

  if (!formId || isNaN(formIdNumber)) {
    navigateToHome();
    return null;
  }

  if (isFormLoading || isCountDistributionsLoading || countDistributions === undefined) {
    return <Loader />;
  }

  if (!currentForm) {
    navigateToHome();
    return null;
  }

  return (
    <ResultProvider formId={formIdNumber} form={currentForm} countDistributions={countDistributions}>
      <ResultView />
    </ResultProvider>
  );
};
