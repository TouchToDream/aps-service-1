import i18next from "i18next";
import { z } from "zod";

import {
  dictionaryRefField,
  isDictionaryRefFilled,
  optionalDigitsField,
} from "@/features/warehouse/lib/fieldSchemas.ts";
import {
  WAREHOUSE_ITEM_KINDS,
  WAREHOUSE_UNITS,
} from "@/features/warehouse/types.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";

export const warehouseItemSchema = () =>
  z
    .object({
      kind: zodEnumFromConst(WAREHOUSE_ITEM_KINDS),
      category: dictionaryRefField(),
      name: z.string().trim().min(1, i18next.t("validation.field_required")),
      price: optionalDigitsField(),
      purchasePrice: optionalDigitsField(),
      supplierName: z.string().trim(),
      orderUrl: z
        .string()
        .trim()
        .refine((value) => !value || z.url().safeParse(value).success, {
          message: i18next.t("validation.url_invalid"),
        }),
      unit: zodEnumFromConst(WAREHOUSE_UNITS),
      minQuantity: optionalDigitsField(),
      storagePlace: dictionaryRefField(),
    })
    .superRefine((values, ctx) => {
      if (!isDictionaryRefFilled(values.category)) {
        ctx.addIssue({
          code: "custom",
          path: ["category"],
          message: i18next.t("validation.field_required"),
        });
      }
      // Showcase items are sold over the counter — the price must be on the card.
      if (values.kind === WAREHOUSE_ITEM_KINDS.SHOWCASE && !values.price) {
        ctx.addIssue({
          code: "custom",
          path: ["price"],
          message: i18next.t("validation.field_required"),
        });
      }
    });

export type WarehouseItemFormValues = z.input<
  ReturnType<typeof warehouseItemSchema>
>;
export type WarehouseItemSchema = z.infer<
  ReturnType<typeof warehouseItemSchema>
>;
