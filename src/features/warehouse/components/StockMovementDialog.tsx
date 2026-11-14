import { Controller, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LocationSelectField } from "@/features/warehouse/components/LocationSelectField.tsx";
import { useStockMovementForm } from "@/features/warehouse/hooks/useStockMovementForm.ts";
import {
  MANUAL_STOCK_REASONS,
  type ManualStockReason,
} from "@/features/warehouse/types.ts";
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

interface StockMovementDialogProps {
  itemId: number;
  reason: ManualStockReason;
  defaultLocationId: number | null;
  onClose: () => void;
}

export const StockMovementDialog = ({
  itemId,
  reason,
  defaultLocationId,
  onClose,
}: StockMovementDialogProps) => {
  const { t } = useTranslation();
  const { methods, onSubmit, isPending } = useStockMovementForm({
    itemId,
    reason,
    defaultLocationId,
    onSuccess: onClose,
  });
  const {
    control,
    register,
    formState: { errors },
  } = methods;
  const isCorrection = reason === MANUAL_STOCK_REASONS.CORRECTION;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(`warehouse.stock.${reason}`)}</DialogTitle>
          <DialogDescription>
            {t("warehouse.stock.irreversible")}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Controller
              name="locationId"
              control={control}
              render={({ field }) => (
                <LocationSelectField
                  label={t("warehouse.stock.location")}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.locationId?.message}
                />
              )}
            />
            <div className="flex flex-col gap-1">
              <Label>{t("warehouse.stock.quantity")}</Label>
              <FormField
                autoComplete="off"
                inputMode={isCorrection ? "text" : "numeric"}
                error={errors.quantity}
                {...register("quantity")}
              />
              {isCorrection && (
                <p className="text-xs text-muted-foreground">
                  {t("warehouse.stock.correctionHint")}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label>{t("warehouse.stock.note")}</Label>
              <FormField
                autoComplete="off"
                error={errors.note}
                {...register("note")}
              />
            </div>
            {errors.root && (
              <p className="text-sm text-destructive">{errors.root.message}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
