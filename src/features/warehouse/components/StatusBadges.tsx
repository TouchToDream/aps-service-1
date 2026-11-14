import { useTranslation } from "react-i18next";

import {
  DONOR_STATUSES,
  type DonorStatus,
  PART_STATUSES,
  type PartStatus,
} from "@/features/warehouse/types.ts";
import { Badge } from "@/shared/components/ui/badge.tsx";

interface DonorStatusBadgeProps {
  status: DonorStatus;
}

export const DonorStatusBadge = ({ status }: DonorStatusBadgeProps) => {
  const { t } = useTranslation();
  return (
    <Badge
      variant={status === DONOR_STATUSES.AVAILABLE ? "default" : "secondary"}
    >
      {t(`warehouse.donorStatuses.${status}`)}
    </Badge>
  );
};

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
