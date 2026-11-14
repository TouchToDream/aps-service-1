import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { StoragePlaceField } from "@/features/warehouse/components/StoragePlaceField.tsx";
import { useOrderToDonor } from "@/features/warehouse/hooks/useOrderToDonor.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";

interface ToDonorDialogProps {
  orderId: number;
  locationId: number | null;
  onClose: () => void;
}

export const ToDonorDialog = ({
  orderId,
  locationId,
  onClose,
}: ToDonorDialogProps) => {
  const { t } = useTranslation();
  const { methods, onSubmit, isPending } = useOrderToDonor({
    orderId,
    locationId,
    onSuccess: onClose,
  });
  const { errors } = methods.formState;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("warehouse.orderActions.toDonorTitle")}</DialogTitle>
          <DialogDescription>
            {t("warehouse.orderActions.toDonorDescription")}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            name="storagePlace"
            control={methods.control}
            render={({ field }) => (
              <StoragePlaceField
                label={t("warehouse.donor.fields.storagePlace")}
                value={field.value}
                onChange={field.onChange}
                error={errors.storagePlace?.message}
              />
            )}
          />
          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {t("warehouse.orderActions.toDonor")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
