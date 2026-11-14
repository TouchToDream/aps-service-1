import { Controller, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ManagerSelect } from "@/features/orders/components/ManagerSelect.tsx";
import { useOrderWarehouseLineForm } from "@/features/orders/hooks/useOrderWarehouseLineForm.ts";
import { useManagerOptions } from "@/features/users/hooks/useManagerOptions.ts";
import { SelectedWarehouseLine } from "@/features/warehouse/components/picker/SelectedWarehouseLine.tsx";
import { WarehouseLineFields } from "@/features/warehouse/components/picker/WarehouseLineFields.tsx";
import { isDonorPartSource } from "@/features/warehouse/lib/service.ts";
import type { WarehouseSearchResult } from "@/features/warehouse/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { DialogFooter } from "@/shared/components/ui/dialog.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

interface OrderWarehouseLineFormProps {
  orderId: number;
  result: WarehouseSearchResult;
  onBack: () => void;
  onClose: () => void;
}

export const OrderWarehouseLineForm = ({
  orderId,
  result,
  onBack,
  onClose,
}: OrderWarehouseLineFormProps) => {
  const { t } = useTranslation();
  const { users, isLoadingUsers } = useManagerOptions({ activeOnly: true });
  const { methods, onSubmit, isPending } = useOrderWarehouseLineForm({
    orderId,
    result,
    onSuccess: onClose,
  });
  const { errors } = methods.formState;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex min-w-0 flex-1 flex-col gap-4"
      >
        <SelectedWarehouseLine result={result} onChange={onBack} />
        <WarehouseLineFields isSinglePiece={isDonorPartSource(result)} />
        <div className="flex flex-col gap-1">
          <Label>{t("orders.orderTable.form.executor")}</Label>
          <Controller
            name="managerId"
            control={methods.control}
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
        {errors.root && (
          <p className="text-sm text-destructive">{errors.root.message}</p>
        )}
        <DialogFooter className="mt-auto">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {t("common.add")}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
};
