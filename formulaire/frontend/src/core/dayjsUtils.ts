// utils/timeUtils.ts
import dayjs, { Dayjs } from "dayjs";
import { HH_MM } from "./constants";

/**
 * Convertit une chaîne "HH:mm" en objet Dayjs
 * @param timeStr chaîne au format "HH:mm"
 * @returns Dayjs ou null si invalide
 */
export const timeStringToDayjs = (timeStr: string | undefined | null): Dayjs | null => {
  if (!timeStr) return null;
  const parts = timeStr.split(":");
  if (parts.length !== 2) return null;

  const [hours, minutes] = parts.map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;

  return dayjs().hour(hours).minute(minutes).second(0).millisecond(0);
};

/**
 * Convertit un Dayjs en chaîne "HH:mm"
 * @param value Dayjs
 * @returns string au format "HH:mm" ou undefined si null
 */
export const dayjsToTimeString = (value: Dayjs | null | undefined): string | undefined => {
  if (!value) return undefined;
  return value.format(HH_MM);
};
