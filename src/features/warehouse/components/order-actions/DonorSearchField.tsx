import { useTranslation } from "react-i18next";

import {
  type DonorOptionMeta,
  fetchAvailableDonorOptions,
} from "@/features/warehouse/lib/searchFetchers.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { Label } from "@/shared/components/ui/label.tsx";
import SearchableSelect, {
  type SearchableSelectOption,
} from "@/widgets/searchable-select";

interface DonorSearchFieldProps {
  label: string;
  value: string;
  /** Typing drops the previous choice until an option is picked again. */
  onType: (text: string) => void;
  onSelect: (donorId: number, label: string) => void;
  error?: string;
}

export const DonorSearchField = ({
  label,
  value,
  onType,
  onSelect,
  error,
}: DonorSearchFieldProps) => {
  const { t } = useTranslation();

  const renderOption = (option: SearchableSelectOption<DonorOptionMeta>) => (
    <span className="flex w-full items-center justify-between gap-2">
      <span className="truncate">{option.name}</span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {[
          option.meta.locationName ?? t("warehouse.noLocation"),
          option.meta.storagePlaceName,
        ]
          .filter(Boolean)
          .join(" · ")}
      </span>
    </span>
  );

  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <SearchableSelect<DonorOptionMeta>
        value={value}
        onChange={onType}
        onSelect={(option) => onSelect(option.id, option.name)}
        fetchItems={fetchAvailableDonorOptions}
        queryKey={queryKeys.warehouse.availableDonorOptions()}
        renderOption={renderOption}
        // SearchableSelect renders the message itself (red border + text).
        error={error ? { type: "validate", message: error } : undefined}
      />
    </div>
  );
};
