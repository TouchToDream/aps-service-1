import { HandCoins, PackageOpen } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { SellDonorDialog } from "@/features/warehouse/components/order-actions/SellDonorDialog.tsx";
import { ToDonorDialog } from "@/features/warehouse/components/order-actions/ToDonorDialog.tsx";
import { useCanManageWarehouse } from "@/features/warehouse/hooks/useCanManageWarehouse.ts";
import { HintTooltip } from "@/shared/components/common/HintTooltip.tsx";
import { Button } from "@/shared/components/ui/button.tsx";

type OrderWarehouseDialog = "toDonor" | "sellDonor" | null;

interface OrderWarehouseActionsProps {
  orderId: number;
  /** "To donors" needs the order's office — the new donor is kept there. */
  locationId: number | null;
}

/**
 * Lives on the products & services card: both actions are about the order's
 * goods. An exchange is just the two pressed one after the other.
 */
export const OrderWarehouseActions = ({
  orderId,
  locationId,
}: OrderWarehouseActionsProps) => {
  const { t } = useTranslation();
  const canManage = useCanManageWarehouse();
  const [dialog, setDialog] = useState<OrderWarehouseDialog>(null);

  if (!canManage) return null;

  const hasLocation = locationId !== null;

  return (
    <div className="flex gap-2">
      <HintTooltip
        hint={
          hasLocation
            ? t("warehouse.orderActions.toDonorHint")
            : t("warehouse.orderActions.noLocation")
        }
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("warehouse.orderActions.toDonor")}
          disabled={!hasLocation}
          onClick={() => setDialog("toDonor")}
        >
          <PackageOpen size={16} />
        </Button>
      </HintTooltip>
      <HintTooltip hint={t("warehouse.orderActions.sellDonorHint")}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("warehouse.orderActions.sellDonor")}
          onClick={() => setDialog("sellDonor")}
        >
          <HandCoins size={16} />
        </Button>
      </HintTooltip>
      {dialog === "toDonor" && (
        <ToDonorDialog
          orderId={orderId}
          locationId={locationId}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === "sellDonor" && (
        <SellDonorDialog orderId={orderId} onClose={() => setDialog(null)} />
      )}
    </div>
  );
};
