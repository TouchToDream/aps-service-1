import { Info } from "lucide-react";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { suppliersApi } from "@/features/dictionaries/api";
import { createNameSearchFetcher } from "@/features/orders/lib/searchFetchers.ts";
import { DictionaryRefField } from "@/features/warehouse/components/DictionaryRefField.tsx";
import { StoragePlaceField } from "@/features/warehouse/components/StoragePlaceField.tsx";
import type {
  WarehouseItemFormValues,
  WarehouseItemSchema,
} from "@/features/warehouse/lib/item.schema.ts";
import { createCategoryFetcher } from "@/features/warehouse/lib/searchFetchers.ts";
import { isShowcaseKind } from "@/features/warehouse/lib/service.ts";
import {
  WAREHOUSE_UNITS,
  type WarehouseItemKind,
} from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";
import { stripNonDigits } from "@/shared/lib/utils.ts";
import SearchableSelect from "@/widgets/searchable-select";

const fetchSuppliers = createNameSearchFetcher(suppliersApi.getAll);

interface ItemFormFieldsProps {
  kind: WarehouseItemKind;
}

export const ItemFormFields = ({ kind }: ItemFormFieldsProps) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<WarehouseItemFormValues, unknown, WarehouseItemSchema>();
  const fetchCategories = useMemo(() => createCategoryFetcher(kind), [kind]);

  const digitsOnly = {
    inputMode: "numeric" as const,
    onInput: (e: { currentTarget: HTMLInputElement }) => {
      e.currentTarget.value = stripNonDigits(e.currentTarget.value);
    },
  };

  return (
    <div className="flex flex-col gap-4">
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <DictionaryRefField
            label={t("warehouse.item.fields.category")}
            value={field.value}
            onChange={field.onChange}
            fetchItems={fetchCategories}
            queryKey={queryKeys.warehouse.categories(kind)}
            error={errors.category?.message}
          />
        )}
      />

      <div className="flex flex-col gap-1">
        <Label>{t("warehouse.item.fields.name")}</Label>
        <FormField
          autoComplete="off"
          error={errors.name}
          {...register("name")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label>
            {t("warehouse.item.fields.price")}
            {isShowcaseKind(kind) && " *"}
          </Label>
          <FormField
            error={errors.price}
            {...digitsOnly}
            {...register("price")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>{t("warehouse.item.fields.purchasePrice")}</Label>
          <FormField
            error={errors.purchasePrice}
            {...digitsOnly}
            {...register("purchasePrice")}
          />
        </div>
      </div>
      <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {t("warehouse.item.purchasePriceHint")}
      </p>

      <div className="flex flex-col gap-1">
        <Label>{t("warehouse.item.fields.supplier")}</Label>
        <Controller
          name="supplierName"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              value={field.value}
              onChange={field.onChange}
              onSelect={(option) => field.onChange(option.name)}
              fetchItems={fetchSuppliers}
              queryKey={queryKeys.dictionaries.suppliers()}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label>{t("warehouse.item.fields.orderUrl")}</Label>
        <FormField
          type="url"
          autoComplete="off"
          placeholder="https://"
          error={errors.orderUrl}
          {...register("orderUrl")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>{t("warehouse.item.fields.unit")}</Label>
          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(WAREHOUSE_UNITS).map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {t(`warehouse.units.${unit}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>{t("warehouse.item.fields.minQuantity")}</Label>
          <FormField
            error={errors.minQuantity}
            {...digitsOnly}
            {...register("minQuantity")}
          />
        </div>
      </div>

      <Controller
        name="storagePlace"
        control={control}
        render={({ field }) => (
          <StoragePlaceField
            label={t("warehouse.item.fields.storagePlace")}
            value={field.value}
            onChange={field.onChange}
            error={errors.storagePlace?.message}
          />
        )}
      />
    </div>
  );
};
