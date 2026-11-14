import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ORDERS_LINKS } from "@/features/orders/navigation.ts";
import { QUICK_ORDERS_LINKS } from "@/features/quick-orders/navigation.ts";
import type { DonorPart } from "@/features/warehouse/types.ts";
import { Badge } from "@/shared/components/ui/badge.tsx";

interface PartAvailabilityBadgeProps {
  part: Pick<DonorPart, "isAvailable" | "usedInOrderId" | "usedInQuickOrderId">;
}

/**
 * "Free" / "Used" — derived by the backend from whether an order or a
 * quick-order line holds the part. A used part links to that order.
 */
export const PartAvailabilityBadge = ({ part }: PartAvailabilityBadgeProps) => {
  const { t } = useTranslation();

  if (part.isAvailable) {
    return <Badge>{t("warehouse.partAvailability.available")}</Badge>;
  }

  const link =
    part.usedInOrderId !== null
      ? {
          to: ORDERS_LINKS.detail(part.usedInOrderId),
          label: t("warehouse.stock.order", { id: part.usedInOrderId }),
        }
      : part.usedInQuickOrderId !== null
        ? {
            to: QUICK_ORDERS_LINKS.detail(part.usedInQuickOrderId),
            label: t("warehouse.stock.quickOrder", {
              id: part.usedInQuickOrderId,
            }),
          }
        : null;

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <Badge variant="secondary">{t("warehouse.partAvailability.used")}</Badge>
      {link && (
        <Link
          to={link.to}
          // The row itself opens the edit dialog — don't trigger it.
          onClick={(event) => event.stopPropagation()}
          className="text-sm text-primary hover:underline"
        >
          {link.label}
        </Link>
      )}
    </span>
  );
};
