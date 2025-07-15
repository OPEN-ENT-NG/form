import { FC, useEffect, useState } from "react";
import { ICreationQuestionTypesProps } from "../types";
import { Box } from "@cgi-learning-hub/ui";
import { cursorItemStyle, cursorLineStyle, cursorPropsStyle } from "./style";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";
import { IQuestion, IQuestionSpecificFields } from "~/core/models/question/types";
import { initDefaultSpecificFields, useGetCursorTextFieldProps } from "./utils";
import { CursorTextField } from "~/components/CursorTextField";
import { CursorProp } from "./enums";
import { CursorTextFieldType } from "~/components/CursorTextField/enums";

export const CreationQuestionCursor: FC<ICreationQuestionTypesProps> = ({ question }) => {
  const { currentEditingElement, setCurrentEditingElement } = useCreation();
  const [currentQuestionSpecificFields, setCurrentQuestionSpecificFiels] = useState<IQuestionSpecificFields>(
    initDefaultSpecificFields(question),
  );

  // Save question when we this component is not the edited one anymore
  useEffect(() => {
    console.log("Saving question specific fields:", currentQuestionSpecificFields);
    if (!currentEditingElement || !isCurrentEditingElement(question, currentEditingElement)) {
      return;
    }
    const updatedQuestion = {
      ...question,
      specificFields: currentQuestionSpecificFields,
    } as IQuestion;
    console.log("updatedQuestion", updatedQuestion);

    setCurrentEditingElement(updatedQuestion);
  }, [currentQuestionSpecificFields, setCurrentEditingElement]);

  // Locally save the changed value in the question's specificFields
  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    cursorProp: CursorProp,
    inputType: CursorTextFieldType,
  ) => {
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
