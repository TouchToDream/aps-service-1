import i18next from "i18next";
import { z } from "zod";

const DIGITS = /^\d+$/;

/** Optional whole-number money/amount field: empty or digits only. */
export function optionalDigitsField() {
  return z
    .string()
    .trim()
    .refine((value) => !value || DIGITS.test(value), {
      message: i18next.t("validation.digitsOnly"),
    });
}

/** Required whole-number money field. */
export function requiredDigitsField() {
  return z
    .string()
    .trim()
    .min(1, i18next.t("validation.field_required"))
    .regex(DIGITS, i18next.t("validation.digitsOnly"));
}

/**
 * "Pick from the list or type a new one" dictionary field — the backend
 * accepts `*_id` or `*_name` and creates the record on the fly.
 */
export function dictionaryRefField() {
  return z.object({
    id: z.number().int().positive().nullable(),
    name: z.string(),
  });
}

export function isDictionaryRefFilled(ref: {
  id: number | null;
  name: string;
}): boolean {
  return ref.id !== null || ref.name.trim().length > 0;
}
