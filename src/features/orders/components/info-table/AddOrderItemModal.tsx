import { AlertCircle, Info } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { OrderWarehouseProductPane } from "@/features/orders/components/info-table/OrderWarehouseProductPane.tsx";
import {
  getOrderItemInitialValues,
  getOrderItemModalTitle,
} from "@/features/orders/components/info-table/services.ts";
import { ManagerSelect } from "@/features/orders/components/ManagerSelect.tsx";
import { useAddOrderItemForm } from "@/features/orders/hooks/useAddOrderItemForm.ts";
import { useOrderItemSubmit } from "@/features/orders/hooks/useOrderItemSubmit.ts";
import type { OrderItem, OrderItemType } from "@/features/orders/types.ts";
import { InfoField } from "@/features/warehouse/components/InfoField.tsx";
import {
  type ProductSourceTab,
  ProductSourceTabs,
} from "@/features/warehouse/components/picker/ProductSourceTabs.tsx";
import {
  ADD_PRODUCT_DIALOG_CLASS,
  READ_ONLY_INPUT_CLASS,
} from "@/features/warehouse/lib/constants.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
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
import { cn, formatMoney, stripNonDigits } from "@/shared/lib/utils.ts";
import SearchableSelect from "@/widgets/searchable-select";

interface AddOrderItemModalProps {
  orderId: number;
  /** Office of the order — the warehouse picker shows stock for it. */
  locationId: number | null;
  type: OrderItemType;
  open: boolean;
  onClose: () => void;
  editItem?: OrderItem;
  readOnly?: boolean;
}

const AddOrderItemModal = ({
  orderId,
  locationId,
  type,
  open,
  onClose,
  editItem,
  readOnly,
}: AddOrderItemModalProps) => {
  const { t } = useTranslation();
  const isAddingProduct = type === "product" && !editItem;
  const [source, setSource] = useState<ProductSourceTab>("manual");
  // A line sold from the warehouse keeps the card's name and purchase price.
  const isWarehouseLine =
    editItem?.type === "product" &&
    (editItem.warehouseItemId !== null ||
      editItem.donorPartId !== null ||
      editItem.warehouseDonorId !== null);
  // A donor part or a whole donor is one physical thing — quantity stays 1.
  const isDonorPartLine =
    editItem?.type === "product" &&
    (editItem.donorPartId !== null || editItem.warehouseDonorId !== null);

  const initialData = editItem
    ? getOrderItemInitialValues(editItem)
    : undefined;

  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    users,
    isLoadingUsers,
    fetchNameItems,
    nameQueryKey,
    onCreateNameItem,
    fetchSuppliers,
    onCreateSupplier,
    supplierDisplay,
    onSupplierChange,
    onSupplierSelect,
    fetchOutsourcers,
    onCreateOutsourcer,
    outsourcerDisplay,
    onOutsourcerChange,
    onOutsourcerSelect,
  } = useAddOrderItemForm({
    type,
    initialValues: initialData?.formValues,
    currentManager: editItem?.manager,
    initialSupplierDisplay: initialData?.supplierDisplay,
    initialOutsourcerDisplay: initialData?.outsourcerDisplay,
  });

  const { onSubmit, isPending } = useOrderItemSubmit({
    orderId,
    type,
    editItemId: editItem?.id,
    onSuccess: onClose,
    setError,
  });

  const title = getOrderItemModalTitle(t, type, !!editItem);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className={cn(isAddingProduct && ADD_PRODUCT_DIALOG_CLASS)}
        onEscapeKeyDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {isAddingProduct && (
          <ProductSourceTabs value={source} onChange={setSource} />
        )}
        {isAddingProduct && source === "warehouse" ? (
          <OrderWarehouseProductPane
            orderId={orderId}
            locationId={locationId}
            onManual={() => setSource("manual")}
            onClose={onClose}
          />
        ) : (
          <>
            {isWarehouseLine && !readOnly && (
              <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 shrink-0" />
                {t("warehouse.picker.readOnlyHint")}
              </div>
            )}
            {readOnly && (
              <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {type === "product"
                  ? t("orders.orderTable.readOnly.product")
                  : t("orders.orderTable.readOnly.service")}
              </div>
            )}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-1 flex-col gap-4"
            >
              <fieldset disabled={readOnly} className="contents">
                <div className="flex flex-col gap-1">
                  <Label>{t("orders.orderTable.form.name")}</Label>
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
                  <Label>{t("orders.orderTable.form.price")}</Label>
                  <Input
                    inputMode="numeric"
                    onInput={(e) => {
                      e.currentTarget.value = stripNonDigits(
                        e.currentTarget.value,
                      );
                    }}
                    {...register("price")}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                {type === "product" && isWarehouseLine && (
                  // The backend takes it from the warehouse card — show, never edit.
                  <InfoField label={t("orders.orderTable.form.purchasePrice")}>
                    {editItem?.purchasePrice
                      ? formatMoney(editItem.purchasePrice)
                      : "—"}
                  </InfoField>
                )}
                {type === "product" && !isWarehouseLine && (
                  <div className="flex flex-col gap-1">
                    <Label>{t("orders.orderTable.form.purchasePrice")}</Label>
                    <Input
                      inputMode="numeric"
                      onInput={(e) => {
                        e.currentTarget.value = stripNonDigits(
                          e.currentTarget.value,
                        );
                      }}
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
                    <Label>{t("orders.orderTable.form.costPrice")}</Label>
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
                  <Label>{t("orders.orderTable.form.quantity")}</Label>
                  <Input
                    {...register("quantity")}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    readOnly={isDonorPartLine}
                    className={READ_ONLY_INPUT_CLASS}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-destructive">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
                {type === "product" && !isWarehouseLine && (
                  <div className="flex flex-col gap-1">
                    <Label>{t("orders.orderTable.form.supplierName")}</Label>
                    <SearchableSelect
                      value={supplierDisplay}
                      onChange={onSupplierChange}
                      onSelect={onSupplierSelect}
                      fetchItems={fetchSuppliers}
                      queryKey={queryKeys.dictionaries.suppliers()}
                      onCreateItem={onCreateSupplier}
                    />
                  </div>
                )}
                {type === "service" && (
                  <div className="flex flex-col gap-1">
                    <Label>{t("orders.orderTable.form.outsourcer")}</Label>
                    <SearchableSelect
                      value={outsourcerDisplay}
                      onChange={onOutsourcerChange}
                      onSelect={onOutsourcerSelect}
                      fetchItems={fetchOutsourcers}
                      queryKey={queryKeys.dictionaries.outsourcers()}
                      onCreateItem={onCreateOutsourcer}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <Label>{t("orders.orderTable.form.executor")}</Label>
                  <Controller
                    name="managerId"
                    control={control}
                    render={({ field }) => (
                      <ManagerSelect
                        value={field.value}
                        onChange={field.onChange}
                        users={users}
                        isLoading={isLoadingUsers}
                      />
                    )}
                  />
                  {errors.managerId && (
                    <p className="text-sm text-destructive">
                      {errors.managerId.message}
                    </p>
                  )}
                </div>
              </fieldset>
              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
              {/* Pinned to the bottom so it lines up with the warehouse tab. */}
              <DialogFooter className="mt-auto">
                <Button type="button" variant="outline" onClick={onClose}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={isPending || readOnly}>
                  {editItem ? t("common.save") : t("common.add")}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderItemModal;
