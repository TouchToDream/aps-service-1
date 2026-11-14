import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { WAREHOUSE_LINKS } from "@/features/warehouse/navigation.ts";
import { Badge } from "@/shared/components/ui/badge.tsx";

interface WarehouseLineBadgeProps {
  warehouseItemId: number | null;
  donorPartId: number | null;
}

/**
 * Where an order / quick-sale line came from. There is no single-part screen,
 * so a donor part leads to the parts list.
 */
export const WarehouseLineBadge = ({
  warehouseItemId,
  donorPartId,
}: WarehouseLineBadgeProps) => {
  const { t } = useTranslation();

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
