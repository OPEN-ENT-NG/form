import { IFormElement } from "~/core/models/formElement/types";
import { IFormElementIdType } from "./types";
import {
  areEquals,
  getFollowingFormElement,
  getFormElementIdType,
  getStringifiedFormElementIdType,
  isQuestion,
  isSection,
  stringifyFormElementIdType,
} from "~/core/models/formElement/utils";
import { getNextFormElement, getNextFormElements } from "~/core/models/question/utils";

export const buildProgressObject = (historicFormElementIds: number[], longuestRemainingPath: number) => {
  return {
    historicFormElementIds: historicFormElementIds,
    longuestRemainingPath: longuestRemainingPath,
  };
};

export const getLongestPathsMap = (formElements: IFormElement[]): Map<string, number> => {
  const pathsMap = getPathsMap(formElements);
  const [firstKey] = pathsMap.keys();
  const longestPathsMap: Map<string, number> = new Map<string, number>();
  if (firstKey) fillLongestPathsMap(firstKey, pathsMap, longestPathsMap);
  return longestPathsMap;
};

export const getPathsMap = (formElements: IFormElement[]): Map<string, (IFormElementIdType | undefined)[]> => {
  const pathsMap = new Map<string, (IFormElementIdType | undefined)[]>();
  for (const formElement of formElements) {
    const formElementIdType = getStringifiedFormElementIdType(formElement);
    if (!formElementIdType) continue;
    pathsMap.set(formElementIdType, getAllPotentialNextFormElementsIdTypes(formElement, formElements));
  }
  return pathsMap;
};

export const getAllPotentialNextFormElements = (
  formElement: IFormElement,
  formElements: IFormElement[],
): (IFormElement | undefined)[] => {
  if (isSection(formElement)) {
    const conditionalQuestions = formElement.questions.filter((q) => q.conditional);
    if (conditionalQuestions.length <= 0) {
      const followingFormElement = getFollowingFormElement(formElement, formElements);
      return followingFormElement ? [followingFormElement] : [];
    }

    const choices = conditionalQuestions.flatMap((q) => q.choices);
    return choices.map((qc) => qc && getNextFormElement(qc, formElements)).filter((e): e is IFormElement => e !== null);
  }

  if (isQuestion(formElement)) {
    if (formElement.conditional) return getNextFormElements(formElement, formElements);
    const followingFormElement = getFollowingFormElement(formElement, formElements);
    return followingFormElement ? [followingFormElement] : [];
  }

  return [];
};

export const getAllPotentialNextFormElementsIdTypes = (
  formElement: IFormElement,
  formElements: IFormElement[],
): (IFormElementIdType | undefined)[] => {
  let potentialNextFormElementIdTypes = getAllPotentialNextFormElements(formElement, formElements).map((e) =>
    e ? getFormElementIdType(e) : undefined,
  );
  const isThereUndefined: boolean = potentialNextFormElementIdTypes.some((feit) => !feit);
  potentialNextFormElementIdTypes = potentialNextFormElementIdTypes.filter((feit) => feit); // filter undefined values
  const uniqueNextFormElementIdTypes: (IFormElementIdType | undefined)[] = [];

  potentialNextFormElementIdTypes
    .filter((pfeit) => pfeit != null)
    .map((pfeit) => {
      const match = uniqueNextFormElementIdTypes.find((feit) => areEquals(feit, pfeit));
      if (!match) uniqueNextFormElementIdTypes.push(pfeit);
    });

  if (isThereUndefined) uniqueNextFormElementIdTypes.push(undefined);
  return uniqueNextFormElementIdTypes;
};

export const fillLongestPathsMap = (
  stringifiedFormElementIdType: string,
  pathsMap: Map<string, (IFormElementIdType | undefined)[]>,
  longestPathsMap: Map<string, number>,
): number => {
  const currentLongestPath = longestPathsMap.get(stringifiedFormElementIdType);
  const targets = pathsMap.get(stringifiedFormElementIdType);

  // End of the form, there's no next element
  if (!targets || targets.every((feit) => !feit)) {
    longestPathsMap.set(stringifiedFormElementIdType, 0);
    return 0;
  }

  // If we got some targets we keep the max of their respective longestPaths
  const targetsLengths = targets
    .filter((feit) => feit != null)
    .map((feit) => fillLongestPathsMap(stringifyFormElementIdType(feit), pathsMap, longestPathsMap));
  const myLongestPath = (targetsLengths.length > 0 ? Math.max(...targetsLengths) : 0) + 1;
  if (!currentLongestPath || currentLongestPath < myLongestPath)
    longestPathsMap.set(stringifiedFormElementIdType, myLongestPath);
  return myLongestPath;
};
