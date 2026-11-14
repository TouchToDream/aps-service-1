import { useTranslation } from "react-i18next";

import { PART_STATUSES, type PartStatus } from "@/features/warehouse/types.ts";
import { Badge } from "@/shared/components/ui/badge.tsx";

interface PartStatusBadgeProps {
  status: PartStatus;
}

export const PartStatusBadge = ({ status }: PartStatusBadgeProps) => {
  const { t } = useTranslation();
  return (
    <Badge
      variant={status === PART_STATUSES.AVAILABLE ? "default" : "secondary"}
    >
      {t(`warehouse.partStatuses.${status}`)}
    </Badge>
  );
};
