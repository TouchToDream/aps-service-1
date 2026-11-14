import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ManagerSelect } from "@/features/orders/components/ManagerSelect.tsx";
import { useManagerOptions } from "@/features/users/hooks/useManagerOptions.ts";
import { SwapDonorField } from "@/features/warehouse/components/order-actions/SwapDonorField.tsx";
import { StoragePlaceField } from "@/features/warehouse/components/StoragePlaceField.tsx";
import { useDonorSwap } from "@/features/warehouse/hooks/useDonorSwap.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { stripNonDigits } from "@/shared/lib/utils.ts";

interface DonorSwapDialogProps {
  orderId: number;
  locationId: number | null;
  onClose: () => void;
}

/** A single atomic action — not a two-step flow. */
export const DonorSwapDialog = ({
  orderId,
  locationId,
  onClose,
}: DonorSwapDialogProps) => {
  const { t } = useTranslation();
  const { users, isLoadingUsers } = useManagerOptions({ activeOnly: true });
  const { methods, onSubmit, isPending } = useDonorSwap({
    orderId,
    locationId,
    onSuccess: onClose,
  });
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("warehouse.orderActions.swapTitle")}</DialogTitle>
          <DialogDescription>
            {t("warehouse.orderActions.swapDescription")}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <SwapDonorField
            label={t("warehouse.orderActions.swapDonor")}
            value={watch("donorLabel")}
            onType={(text) => {
              setValue("donorLabel", text);
              setValue("donorId", null);
            }}
            onSelect={(donorId, label) => {
              setValue("donorLabel", label);
              setValue("donorId", donorId, { shouldValidate: true });
            }}
            error={errors.donorId?.message}
          />
          <div className="flex flex-col gap-1">
            <Label>{t("warehouse.orderActions.swapPrice")}</Label>
            <FormField
              inputMode="numeric"
              onInput={(e) => {
                e.currentTarget.value = stripNonDigits(e.currentTarget.value);
              }}
              error={errors.price}
              {...register("price")}
            />
          </div>
          <Controller
            name="storagePlace"
            control={control}
            render={({ field }) => (
              <StoragePlaceField
                label={t("warehouse.orderActions.swapStoragePlace")}
                value={field.value}
                onChange={field.onChange}
                error={errors.storagePlace?.message}
              />
            )}
          />
          <div className="flex flex-col gap-1">
            <Label>{t("warehouse.orderActions.swapManager")}</Label>
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
          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {t("warehouse.orderActions.swapConfirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
