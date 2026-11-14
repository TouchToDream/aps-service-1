import { ArrowLeftRight, PackageOpen } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DonorSwapDialog } from "@/features/warehouse/components/order-actions/DonorSwapDialog.tsx";
import { ToDonorDialog } from "@/features/warehouse/components/order-actions/ToDonorDialog.tsx";
import { useCanManageWarehouse } from "@/features/warehouse/hooks/useCanManageWarehouse.ts";

// Same look as the other order header icon buttons (print, create for device).
const ICON_BUTTON_CLASS =
  "h-9 w-9 sm:h-12 sm:w-12 flex items-center justify-center rounded-md border bg-card text-muted-foreground hover:text-foreground shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50";

type OrderWarehouseDialog = "toDonor" | "swap" | null;

interface OrderWarehouseActionsProps {
  orderId: number;
  /** A donor needs an office — both actions require one on the order. */
  locationId: number | null;
}

export const OrderWarehouseActions = ({
  orderId,
  locationId,
}: OrderWarehouseActionsProps) => {
  const { t } = useTranslation();
  const canManage = useCanManageWarehouse();
  const [dialog, setDialog] = useState<OrderWarehouseDialog>(null);

  if (!canManage) return null;

  const hasLocation = locationId !== null;
  const disabledTitle = t("warehouse.orderActions.noLocation");

  return (
    <>
      <button
        type="button"
        className={ICON_BUTTON_CLASS}
        title={
          hasLocation ? t("warehouse.orderActions.toDonorTitle") : disabledTitle
        }
        disabled={!hasLocation}
        onClick={() => setDialog("toDonor")}
      >
        <PackageOpen className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <button
        type="button"
        className={ICON_BUTTON_CLASS}
        title={
          hasLocation ? t("warehouse.orderActions.swapTitle") : disabledTitle
        }
        disabled={!hasLocation}
        onClick={() => setDialog("swap")}
      >
        <ArrowLeftRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      {dialog === "toDonor" && (
        <ToDonorDialog
          orderId={orderId}
          locationId={locationId}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === "swap" && (
        <DonorSwapDialog
          orderId={orderId}
          locationId={locationId}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
};
