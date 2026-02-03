import { FC } from "react";
import { type LoaderFunctionArgs, redirect } from "react-router-dom";

import { ResultProvider } from "~/providers/ResultProvider";
import { formApi } from "~/services/api/services/formulaireApi/formApi";
import { store } from "~/store";

export const resultLoader = async ({ params }: LoaderFunctionArgs) => {
  const formId = params.formId;

  if (typeof formId !== "string") {
    throw redirect("/");
  }

  try {
    await store.dispatch(formApi.endpoints.getForm.initiate({ formId })).unwrap();
  } catch (err) {
    console.error("Form not found", err);
    throw new Response("Form not found", { status: 404 });
  }

  return null;
};

export const Result: FC = () => {
  return <ResultProvider>page result</ResultProvider>;
};
