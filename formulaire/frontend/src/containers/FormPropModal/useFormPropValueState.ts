import { useCallback, useEffect, useState } from "react";
import { FormPropInputValueState } from "./types";
import { initialFormPropInputValueState } from "./utils";
import { FormPropField } from "./enums";
import dayjs from "dayjs";

export const useFormPropInputValueState = () => {
  const [formPropInputValue, setFormPropInputValue] = useState<FormPropInputValueState>(initialFormPropInputValueState);

  const handleFormPropInputValueChange = useCallback(
    (key: FormPropField, value: FormPropInputValueState[FormPropField]) => {
      setFormPropInputValue((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const handleDateChange = useCallback(
    (field: FormPropField.DATE_OPENING | FormPropField.DATE_ENDING, value: dayjs.Dayjs | null) => {
      if (value) {
        handleFormPropInputValueChange(field, value.toDate());
      }
    },
    [handleFormPropInputValueChange],
  );

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
    handleDateChange,
  };
};
