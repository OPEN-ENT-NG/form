import {
  Checkbox,
  IconButton,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@cgi-learning-hub/ui";
import ClearIcon from "@mui/icons-material/Clear";
import { FC, useEffect, useState } from "react";
import { QuestionTypes } from "~/core/models/question/enum";
import { IResponse } from "~/core/models/response/type";
import { useResponse } from "~/providers/ResponseProvider";
import { IRespondQuestionTypesProps } from "../types";

export const RespondQuestionMatrix: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponses, updateQuestionResponses } = useResponse();
  const [responseMap, setResponseMap] = useState<Map<number, IResponse[]>>(new Map());

  useEffect(() => {
    const map = new Map<number, IResponse[]>();
    question.children?.forEach((child) => {
      if (!child.id) return;
      map.set(child.id, getQuestionResponses({ ...child, sectionId: question.sectionId }));
    });
    setResponseMap(map);
  }, [question, getQuestionResponses]);

  const isSelected = (childId: number | null, choiceId: number | null) => {
    if (!childId) return false;
    const responses = responseMap.get(childId);
    return responses?.some((r) => r.choiceId === choiceId && r.selected) ?? false;
  };

  const toggleCheckbox = (childId: number | null, choiceId: number | null) => {
    if (!childId) return;
    const responses = responseMap.get(childId);
    const child = question.children?.find((c) => c.id === childId);
    if (!responses || !child) return;

    const updatedResponses = responses.map((r) => (r.choiceId === choiceId ? { ...r, selected: !r.selected } : r));

    updateQuestionResponses({ ...child, sectionId: question.sectionId }, updatedResponses);
  };

  const toggleRadio = (childId: number | null, choiceId: number | null) => {
    if (!childId) return;
    const responses = responseMap.get(childId);
    const child = question.children?.find((c) => c.id === childId);
    const choice = question.choices?.find((c) => c.id === choiceId);
    if (!responses || !child || !choice) return;

    const updatedResponse: IResponse = {
      id: null,
      questionId: childId,
      choiceId: choiceId ?? undefined,
      answer: choice.value,
      distributionId: undefined,
      originalId: undefined,
      customAnswer: undefined,
      files: [],
      selected: true,
      selectedIndexList: [],
      choicePosition: undefined,
      image: null,
    };

    updateQuestionResponses({ ...child, sectionId: question.sectionId }, [updatedResponse]);
  };

  const clearRow = (childId: number | null) => {
    if (!childId) return;
    const responses = responseMap.get(childId);
    const child = question.children?.find((c) => c.id === childId);
    if (!responses || !child) return;

    const updatedResponses = responses.map((r) => ({ ...r, selected: false }));

    updateQuestionResponses(child, updatedResponses);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "10%" }}></TableCell>
            {question.choices?.map((choice, index) => (
              <TableCell align="center" key={index}>
                {choice.value}
              </TableCell>
            ))}
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {question.children
            ?.sort((a, b) => {
              return (a.matrixPosition ?? 0) - (b.matrixPosition ?? 0);
            })
            .map((child) => (
              <TableRow key={child.id}>
                <TableCell sx={{ width: "10%" }}>{child.title}</TableCell>
                {question.choices?.map((choice) => (
                  <TableCell align="center" key={choice.id}>
                    {child.questionType === QuestionTypes.MULTIPLEANSWER ? (
                      <Checkbox
                        checked={isSelected(child.id, choice.id)}
                        onChange={() => {
                          toggleCheckbox(child.id, choice.id);
                        }}
                      />
                    ) : (
                      <Radio
                        checked={isSelected(child.id, choice.id)}
                        onChange={() => {
                          toggleRadio(child.id, choice.id);
                        }}
                      />
                    )}
                  </TableCell>
                ))}

                <TableCell width="3rem">
                  <IconButton
                    onClick={() => {
                      clearRow(child.id);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
