import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type {
  WarehouseLineFormValues,
  WarehouseLineSchema,
} from "@/features/warehouse/lib/line.schema.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { stripNonDigits } from "@/shared/lib/utils.ts";

interface WarehouseLineFieldsProps {
  /** Donor parts are single pieces — quantity is fixed to 1. */
  isSinglePiece: boolean;
}

export const WarehouseLineFields = ({
  isSinglePiece,
}: WarehouseLineFieldsProps) => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<WarehouseLineFormValues, unknown, WarehouseLineSchema>();

  const onDigitsInput = (e: { currentTarget: HTMLInputElement }) => {
    e.currentTarget.value = stripNonDigits(e.currentTarget.value);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <Label>{t("orders.orderTable.form.price")}</Label>
        <FormField
          autoFocus
          inputMode="numeric"
          onInput={onDigitsInput}
          error={errors.price}
          {...register("price")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>{t("orders.orderTable.form.quantity")}</Label>
        <FormField
          inputMode="numeric"
          onInput={onDigitsInput}
          readOnly={isSinglePiece}
          error={errors.quantity}
          {...register("quantity")}
        />
        {isSinglePiece && (
          <p className="text-xs text-muted-foreground">
            {t("warehouse.picker.partQuantityHint")}
          </p>
        )}
      </div>
    </div>
  );
};
