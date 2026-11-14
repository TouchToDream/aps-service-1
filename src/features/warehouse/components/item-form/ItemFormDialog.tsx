import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ItemFormFields } from "@/features/warehouse/components/item-form/ItemFormFields.tsx";
import { useWarehouseItemForm } from "@/features/warehouse/hooks/useWarehouseItemForm.ts";
import type {
  WarehouseItem,
  WarehouseItemDetail,
  WarehouseItemKind,
} from "@/features/warehouse/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";

interface ItemFormDialogProps {
  kind: WarehouseItemKind;
  item?: WarehouseItem;
  onClose: () => void;
  onSaved?: (item: WarehouseItemDetail) => void;
}

/** Mount only while open — the form takes its defaults on mount. */
export const ItemFormDialog = ({
  kind,
  item,
  onClose,
  onSaved,
}: ItemFormDialogProps) => {
  const { t } = useTranslation();
  const { methods, onSubmit, isPending } = useWarehouseItemForm({
    kind,
    item,
    onSuccess: (saved) => {
      onSaved?.(saved);
      onClose();
    },
  });
  const rootError = methods.formState.errors.root?.message;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t(item ? "warehouse.item.edit" : "warehouse.item.create")} ·{" "}
            {t(`warehouse.kinds.${kind}`)}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <ItemFormFields kind={kind} />
            {rootError && (
              <p className="text-sm text-destructive">{rootError}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {t(item ? "common.save" : "common.add")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
