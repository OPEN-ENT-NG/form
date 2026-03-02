import { QUESTION_TYPE_ICONS } from "~/core/constants";
import { QuestionTypes } from "~/core/models/question/enum";

export const displayTypeIcon = (code: QuestionTypes): string | undefined =>
  QUESTION_TYPE_ICONS[code] ? `/formulaire/public/img/question_type/${QUESTION_TYPE_ICONS[code]}.svg` : undefined;

export const shuffle = <T>(a: T[]): T[] => {
  for (let i = a.length; i; i--) {
    const j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a;
};

export const intersects = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
): boolean => {
  const det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
  if (det === 0) return false;

  const lambda = ((y4 - y3) * (x4 - x1) + (x3 - x4) * (y4 - y1)) / det;
  const gamma = ((y1 - y2) * (x4 - x1) + (x2 - x1) * (y4 - y1)) / det;
  return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
};

export const getEditIcon = (id: number, isQuestion: boolean): string =>
  `<button class="tree-edit-icon tree-edit-icon--${
    isQuestion ? "question" : "section"
  }" data-element-id="${id}" title="Éditer">
    <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  </button>`;
