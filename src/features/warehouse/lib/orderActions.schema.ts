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

/**
 * Order → "Sell donor": a whole donor becomes a product line of the order.
 * Name and purchase price come from the donor card; the manager sets the price.
 */
export const sellDonorSchema = () =>
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
    managerId: z
      .number({ error: i18next.t("validation.field_required") })
      .int()
      .positive(),
  });

export type SellDonorFormValues = z.input<ReturnType<typeof sellDonorSchema>>;
export type SellDonorSchema = z.infer<ReturnType<typeof sellDonorSchema>>;
