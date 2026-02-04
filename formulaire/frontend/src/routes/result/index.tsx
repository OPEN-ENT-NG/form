import { Loader } from "@cgi-learning-hub/ui";
import { skipToken } from "@reduxjs/toolkit/query";
import { FC } from "react";
import { useParams } from "react-router-dom";

import { ResultView } from "~/containers/result/ResultView";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { ResultProvider } from "~/providers/ResultProvider";
import { useGetFormQuery } from "~/services/api/services/formulaireApi/formApi";

export const Result: FC = () => {
  const { formId } = useParams();
  const { navigateToHome } = useFormulaireNavigation();

  const formIdNumber = formId ? parseInt(formId, 10) : NaN;

  const { data: currentForm, isLoading } = useGetFormQuery(
    isNaN(formIdNumber) ? skipToken : { formId: formIdNumber.toString() },
  );

  if (!formId || isNaN(formIdNumber)) {
    navigateToHome();
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!currentForm) {
    navigateToHome();
    return null;
  }

  return (
    <ResultProvider formId={formIdNumber} form={currentForm}>
      <ResultView />
    </ResultProvider>
  );
};
