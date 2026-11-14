import { Info } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { QuickOrderWarehousePane } from "@/features/quick-orders/components/QuickOrderWarehousePane.tsx";
import { useQuickOrderItemForm } from "@/features/quick-orders/hooks/useQuickOrderItemForm.ts";
import type { NewQuickOrderItemSchema } from "@/features/quick-orders/lib/schema.ts";
import type { QuickOrderItemType } from "@/features/quick-orders/types.ts";
import {
  type ProductSourceTab,
  ProductSourceTabs,
} from "@/features/warehouse/components/picker/ProductSourceTabs.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { cn, stripNonDigits } from "@/shared/lib/utils.ts";
import SearchableSelect from "@/widgets/searchable-select";

interface AddQuickOrderItemModalProps {
  type: QuickOrderItemType;
  /** Office of the quick sale — the warehouse picker shows stock for it. */
  locationId: number | null;
  open: boolean;
  onClose: () => void;
  onSave: (values: NewQuickOrderItemSchema) => void;
  editItem?: NewQuickOrderItemSchema;
}

const AddQuickOrderItemModal = ({
  type,
  locationId,
  open,
  onClose,
  onSave,
  editItem,
}: AddQuickOrderItemModalProps) => {
  const { t } = useTranslation();
  const isAddingProduct = type === "product" && !editItem;
  const [source, setSource] = useState<ProductSourceTab>("manual");
  // A line sold from the warehouse keeps the card's name and purchase price.
  const isWarehouseLine =
    !!editItem &&
    (editItem.warehouseItemId !== null || editItem.donorPartId !== null);
  const isDonorPartLine = !!editItem && editItem.donorPartId !== null;

  const {
    control,
    register,
    handleSubmit,
    errors,
    fetchNameItems,
    nameQueryKey,
    onCreateNameItem,
  } = useQuickOrderItemForm({ type, initialValues: editItem });

  const title = editItem
    ? type === "product"
      ? t("quickOrders.itemForm.editProduct")
      : t("quickOrders.itemForm.editService")
    : type === "product"
      ? t("quickOrders.itemForm.addProduct")
      : t("quickOrders.itemForm.addService");

  const onSubmit = (values: NewQuickOrderItemSchema) => {
    onSave(values);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        // Room for the warehouse picker rows (badge, name, price, stock).
        className={cn(isAddingProduct && "sm:max-w-2xl")}
        onEscapeKeyDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {isAddingProduct && (
          <ProductSourceTabs value={source} onChange={setSource} />
        )}
        {isAddingProduct && source === "warehouse" ? (
          <QuickOrderWarehousePane
            locationId={locationId}
            onManual={() => setSource("manual")}
            onSave={onSave}
            onClose={onClose}
          />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {isWarehouseLine && (
              <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 shrink-0" />
                {t("warehouse.picker.readOnlyHint")}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Label>{t("quickOrders.itemForm.name")}</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    fetchItems={fetchNameItems}
                    queryKey={nameQueryKey}
                    onCreateItem={onCreateNameItem}
                    error={errors.name}
                    disabled={isWarehouseLine}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>{t("quickOrders.itemForm.price")}</Label>
              <Input
                inputMode="numeric"
                onInput={(e) => {
                  e.currentTarget.value = stripNonDigits(e.currentTarget.value);
                }}
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
            {type === "product" && (
              <div className="flex flex-col gap-1">
                <Label>{t("quickOrders.itemForm.purchasePrice")}</Label>
                <Input
                  inputMode="numeric"
                  onInput={(e) => {
                    e.currentTarget.value = stripNonDigits(
                      e.currentTarget.value,
                    );
                  }}
                  readOnly={isWarehouseLine}
                  {...register("purchasePrice")}
                />
                {errors.purchasePrice && (
                  <p className="text-sm text-destructive">
                    {errors.purchasePrice.message}
                  </p>
                )}
              </div>
            )}
            {type === "service" && (
              <div className="flex flex-col gap-1">
                <Label>{t("quickOrders.itemForm.costPrice")}</Label>
                <Input
                  inputMode="numeric"
                  onInput={(e) => {
                    e.currentTarget.value = stripNonDigits(
                      e.currentTarget.value,
                    );
                  }}
                  {...register("costPrice")}
                />
                {errors.costPrice && (
                  <p className="text-sm text-destructive">
                    {errors.costPrice.message}
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Label>{t("quickOrders.itemForm.quantity")}</Label>
              <Input
                {...register("quantity", { valueAsNumber: true })}
                type="number"
                inputMode="numeric"
                min={1}
                readOnly={isDonorPartLine}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button type="submit">
                {editItem ? t("common.save") : t("common.add")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddQuickOrderItemModal;
