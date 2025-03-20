import { useEffect, useState } from "react";
import { FormPropInputValueState } from "./types";
import { initialFormPropInputValueState } from "./utils";
import { FormPropField } from "./enums";

export const useFormPropInputValueState = () => {
  const [formPropInputValue, setFormPropInputValue] =
    useState<FormPropInputValueState>(initialFormPropInputValueState);

  const handleFormPropInputValueChange = (
    key: FormPropField,
    value: FormPropInputValueState[FormPropField],
  ) => {
    return setFormPropInputValue((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (formPropInputValue.isPublic) {
      setFormPropInputValue((prev) => ({
        ...prev,
        isEditable: false,
        isMultiple: false,
      }));
    }
  }, [formPropInputValue.isPublic]);

  return {
    formPropInputValue,
    handleFormPropInputValueChange,
  };
};
