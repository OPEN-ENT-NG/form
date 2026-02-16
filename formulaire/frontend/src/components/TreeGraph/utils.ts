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
