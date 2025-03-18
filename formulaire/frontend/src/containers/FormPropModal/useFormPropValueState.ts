import { useState } from "react";
import { FormPropField, FormPropInputValueState } from "./types";
import { initialFormPropInputValueState } from "./utils";

export const useFormPropInputValueState = () => {
  const [formPropInputValue, setFormPropInputValue] =
    useState<FormPropInputValueState>(initialFormPropInputValueState);

  const handleFormPropInputValueChange = (
    key: FormPropField,
    value: FormPropInputValueState[FormPropField],
  ) => {
    setFormPropInputValue((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    formPropInputValue,
    handleFormPropInputValueChange,
  };
};
