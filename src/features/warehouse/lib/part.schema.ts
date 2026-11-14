import i18next from "i18next";
import { z } from "zod";

import {
  dictionaryRefField,
  isDictionaryRefFilled,
} from "@/features/warehouse/lib/fieldSchemas.ts";
import { PART_CONDITIONS, PART_STATUSES } from "@/features/warehouse/types.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";

export const donorPartSchema = () =>
  z
    .object({
      donorId: z.number().int().positive().nullable(),
      category: dictionaryRefField(),
      name: z.string().trim(),
      condition: zodEnumFromConst(PART_CONDITIONS),
      status: zodEnumFromConst(PART_STATUSES),
      storagePlace: dictionaryRefField(),
      locationId: z
        .number({ error: i18next.t("validation.locationRequired") })
        .int()
        .positive(),
      note: z.string().trim(),
    })
    .superRefine((values, ctx) => {
      if (!isDictionaryRefFilled(values.category)) {
        ctx.addIssue({
          code: "custom",
          path: ["category"],
          message: i18next.t("validation.field_required"),
        });
      }
      if (!isDictionaryRefFilled(values.storagePlace)) {
        ctx.addIssue({
          code: "custom",
          path: ["storagePlace"],
          message: i18next.t("validation.field_required"),
        });
      }
    });

export type DonorPartFormValues = z.input<ReturnType<typeof donorPartSchema>>;
export type DonorPartSchema = z.infer<ReturnType<typeof donorPartSchema>>;
