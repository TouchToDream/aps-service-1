import i18next from "i18next";
import { z } from "zod";

import {
  dictionaryRefField,
  isDictionaryRefFilled,
  requiredDigitsField,
} from "@/features/warehouse/lib/fieldSchemas.ts";

const requiredStoragePlace = () =>
  dictionaryRefField().refine(isDictionaryRefFilled, {
    message: i18next.t("validation.field_required"),
  });

/** Order → "To donors": only where to put the new donor. */
export const toDonorSchema = () =>
  z.object({ storagePlace: requiredStoragePlace() });

export type ToDonorFormValues = z.input<ReturnType<typeof toDonorSchema>>;
export type ToDonorSchema = z.infer<ReturnType<typeof toDonorSchema>>;

/** Order → swap: the customer gets a whole donor instead of a repair. */
export const donorSwapSchema = () =>
  z.object({
    donorId: z
      .number()
      .int()
      .positive()
      .nullable()
      .transform((value, ctx) => {
        if (value === null) {
          ctx.addIssue({
            code: "custom",
            message: i18next.t("validation.field_required"),
          });
          return z.NEVER;
        }
        return value;
      }),
    donorLabel: z.string(),
    price: requiredDigitsField(),
    storagePlace: requiredStoragePlace(),
    managerId: z
      .number({ error: i18next.t("validation.field_required") })
      .int()
      .positive(),
  });

export type DonorSwapFormValues = z.input<ReturnType<typeof donorSwapSchema>>;
export type DonorSwapSchema = z.infer<ReturnType<typeof donorSwapSchema>>;
