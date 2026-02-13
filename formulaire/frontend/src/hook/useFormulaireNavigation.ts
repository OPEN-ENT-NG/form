import { useNavigate } from "react-router-dom";

import { FRONT_ROUTES } from "~/core/frontRoutes";

export const useFormulaireNavigation = () => {
  const navigate = useNavigate();

  return {
    navigateToHome: () => {
      navigate(FRONT_ROUTES.home.build());
    },

    navigateToHomeResponses: () => {
      navigate({ pathname: FRONT_ROUTES.home.build(), search: "?tab=RESPONSES" });
    },

    navigateToFormEdit: (formId: string | number) => {
      navigate(FRONT_ROUTES.formEdit.build(formId));
    },

    navigateToFormPreview: (formId: string | number) => {
      navigate(FRONT_ROUTES.formPreview.build(formId));
    },

    navigateToTreeView: (formId: string | number) => {
      navigate(FRONT_ROUTES.formTree.build(formId));
    },

    navigateToFormResult: (formId: string | number) => {
      navigate(FRONT_ROUTES.formResult.build(formId));
    },

    navigateToFormResponse: (formId: string | number, distributionId: string | number) => {
      navigate(FRONT_ROUTES.formResponse.build(formId, distributionId));
    },

    navigateToFormResponseRecap: (formId: string | number, distributionId: string | number) => {
      navigate(FRONT_ROUTES.formResponseRecap.build(formId, distributionId));
    },

    navigateToError401: () => {
      navigate(FRONT_ROUTES.error401.build());
    },
    navigateToError403: () => {
      navigate(FRONT_ROUTES.error403.build());
    },
  };
};
