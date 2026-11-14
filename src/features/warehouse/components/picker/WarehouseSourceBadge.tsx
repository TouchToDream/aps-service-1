import { useTranslation } from "react-i18next";

import {
  WAREHOUSE_SOURCES,
  type WarehouseSource,
} from "@/features/warehouse/types.ts";
import { Badge } from "@/shared/components/ui/badge.tsx";

interface WarehouseSourceBadgeProps {
  source: WarehouseSource;
}

export const WarehouseSourceBadge = ({ source }: WarehouseSourceBadgeProps) => {
  const { t } = useTranslation();
  return (
    <Badge
      variant={
        source === WAREHOUSE_SOURCES.DONOR_PART ? "outline" : "secondary"
      }
      className="shrink-0"
    >
      {t(`warehouse.sources.${source}`)}
    </Badge>
  );
};
