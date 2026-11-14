import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getSelectableDonorStatuses } from "@/features/warehouse/lib/service.ts";
import {
  DONOR_STATUSES,
  type DonorStatus,
} from "@/features/warehouse/types.ts";
import { Label } from "@/shared/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

interface DonorStatusFieldProps {
  /** Status saved on the server; null for a new donor. */
  savedStatus: DonorStatus | null;
  value: DonorStatus;
  onChange: (status: DonorStatus) => void;
}

/**
 * "Given to customer" is reachable only through a swap and is terminal, so it
 * is offered only to a donor that already has it — and then nothing else is.
 */
export const DonorStatusField = ({
  savedStatus,
  value,
  onChange,
}: DonorStatusFieldProps) => {
  const { t } = useTranslation();
  const statuses = getSelectableDonorStatuses(savedStatus);
  const isLocked = savedStatus === DONOR_STATUSES.GIVEN_TO_CUSTOMER;
  const willDispose =
    value === DONOR_STATUSES.DISPOSED &&
    savedStatus !== DONOR_STATUSES.DISPOSED;

  return (
    <div className="flex flex-col gap-1">
      <Label>{t("warehouse.donor.fields.status")}</Label>
      <Select
        value={value}
        onValueChange={(val) => {
          const next = statuses.find((status) => status === val);
          if (next) onChange(next);
        }}
        disabled={isLocked}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {t(`warehouse.donorStatuses.${status}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(isLocked || willDispose) && (
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {t(
            isLocked
              ? "warehouse.donor.statusLockedHint"
              : "warehouse.donor.disposeHint",
          )}
        </p>
      )}
    </div>
  );
};
