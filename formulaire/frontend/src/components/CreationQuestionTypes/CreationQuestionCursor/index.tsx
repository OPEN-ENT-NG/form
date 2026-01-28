import { Box } from "@cgi-learning-hub/ui";
import { FC, useEffect, useState } from "react";

import { CursorTextField } from "~/components/CursorTextField";
import { CursorTextFieldType } from "~/components/CursorTextField/enums";
import { IQuestionSpecificFields } from "~/core/models/question/types";
import { useCreation } from "~/providers/CreationProvider";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";

import { ICreationQuestionTypesProps } from "../types";
import { CursorProp } from "./enums";
import { cursorItemStyle, cursorLineStyle, cursorPropsStyle } from "./style";
import { initDefaultSpecificFields, useGetCursorTextFieldProps } from "./utils";

export const CreationQuestionCursor: FC<ICreationQuestionTypesProps> = ({ question }) => {
  const { currentEditingElement, setCurrentEditingElement } = useCreation();
  const [currentQuestionSpecificFields, setCurrentQuestionSpecificFiels] = useState<IQuestionSpecificFields>(
    initDefaultSpecificFields(question),
  );

  // Save question when we this component is not the edited one anymore
  useEffect(() => {
    if (!currentEditingElement || !isCurrentEditingElement(question, currentEditingElement)) {
      return;
    }

    setCurrentEditingElement((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        specificFields: currentQuestionSpecificFields,
      };
    });
  }, [currentQuestionSpecificFields, setCurrentEditingElement]);

  // Locally save the changed value in the question's specificFields
  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    cursorProp: CursorProp,
    inputType: CursorTextFieldType,
  ) => {
    if (inputType === CursorTextFieldType.NUMBER && isNaN(Number(event.target.value))) return;

    const value = inputType === CursorTextFieldType.NUMBER ? Number(event.target.value) : event.target.value;
    const updatedSpecificFields = {
      ...currentQuestionSpecificFields,
      [cursorProp]: value,
    };
    setCurrentQuestionSpecificFiels(updatedSpecificFields);
  };

  return (
    <Box sx={cursorPropsStyle}>
      {useGetCursorTextFieldProps(currentQuestionSpecificFields).map((lineInfos, lineIndex) => (
        <Box key={lineIndex} sx={cursorLineStyle}>
          {lineInfos.map((columnInfos, columnIndex) => (
            <Box key={columnIndex} sx={cursorItemStyle}>
              {columnInfos.text}
              <CursorTextField
                type={columnInfos.inputType}
                isCurrentEditingElement={isCurrentEditingElement(question, currentEditingElement)}
                propName={columnInfos.specificFieldsPropName}
                onChange={(event) => {
                  handleValueChange(event, columnInfos.specificFieldsPropName, columnInfos.inputType);
                }}
                inputValue={columnInfos.inputValue}
                {...(columnInfos.stepValue && { stepValue: columnInfos.stepValue })}
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};
