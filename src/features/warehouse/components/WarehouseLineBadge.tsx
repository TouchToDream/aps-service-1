import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { WAREHOUSE_LINKS } from "@/features/warehouse/navigation.ts";
import { Badge } from "@/shared/components/ui/badge.tsx";

interface WarehouseLineBadgeProps {
  warehouseItemId: number | null;
  donorPartId: number | null;
  /** Orders only — quick sales can't sell a whole donor. */
  warehouseDonorId?: number | null;
}

/**
 * Where an order / quick-sale line came from. There is no single-part screen,
 * so a donor part leads to the parts list. A sold whole donor has no screen
 * at all (its card is gone), so its badge is not a link.
 */
export const WarehouseLineBadge = ({
  warehouseItemId,
  donorPartId,
  warehouseDonorId = null,
}: WarehouseLineBadgeProps) => {
  const { t } = useTranslation();

  if (warehouseDonorId !== null) {
    return (
      <Badge variant="outline" className="shrink-0">
        {t("warehouse.badges.wholeDonor")}
      </Badge>
    );
  }

  if (warehouseItemId === null && donorPartId === null) return null;

  const isItem = warehouseItemId !== null;
  return (
    <Link
      to={
        isItem ? WAREHOUSE_LINKS.item(warehouseItemId) : WAREHOUSE_LINKS.parts()
      }
      // The row itself opens the edit dialog — don't trigger it.
      onClick={(event) => event.stopPropagation()}
      className="shrink-0"
    >
      <Badge variant="outline" className="hover:bg-muted">
        {t(isItem ? "warehouse.badges.warehouse" : "warehouse.badges.donor")}
      </Badge>
    </Link>
  );
};
