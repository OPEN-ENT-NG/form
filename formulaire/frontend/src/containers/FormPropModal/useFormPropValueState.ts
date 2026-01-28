import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

import { parseFormToValueState } from "~/core/models/form/utils";
import { useHome } from "~/providers/HomeProvider";

import { FormPropField, FormPropModalMode } from "./enums";
import { IFormPropInputValueState } from "./types";
import { initialFormPropInputValueState } from "./utils";

export const useFormPropInputValueState = (mode: FormPropModalMode) => {
  const [formPropInputValue, setFormPropInputValue] =
    useState<IFormPropInputValueState>(initialFormPropInputValueState);
  const [formId, setFormId] = useState<string>("");
  const { selectedForms } = useHome();

  const handleFormPropInputValueChange = useCallback(
    (key: FormPropField, value: IFormPropInputValueState[FormPropField]) => {
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

  useEffect(() => {
    if (mode === FormPropModalMode.UPDATE) {
      const parsedState = parseFormToValueState(selectedForms[0]);
      setFormId(selectedForms[0].id.toString());
      setFormPropInputValue(parsedState);
      return;
    }
    return;
  }, [mode, selectedForms]);

  return {
    formId,
    formPropInputValue,
    handleFormPropInputValueChange,
    handleDateChange,
  };
};
