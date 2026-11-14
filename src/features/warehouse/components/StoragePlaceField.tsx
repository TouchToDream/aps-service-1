import { useTranslation } from "react-i18next";

import { DictionaryRefField } from "@/features/warehouse/components/DictionaryRefField.tsx";
import {
  fetchStoragePlaceOptions,
  type StoragePlaceOptionMeta,
} from "@/features/warehouse/lib/searchFetchers.ts";
import type { DictionaryRef } from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import type { SearchableSelectOption } from "@/widgets/searchable-select";

interface StoragePlaceFieldProps {
  label: string;
  value: DictionaryRef;
  onChange: (value: DictionaryRef) => void;
  error?: string;
}

/**
 * Two places may share a name and differ only by office, so the office is
 * shown next to every option to tell them apart.
 */
export const StoragePlaceField = ({
  label,
  value,
  onChange,
  error,
}: StoragePlaceFieldProps) => {
  const { t } = useTranslation();

  const renderOption = (
    option: SearchableSelectOption<StoragePlaceOptionMeta>,
  ) => (
    <span className="flex w-full items-center justify-between gap-2">
      <span className="truncate">{option.name}</span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {option.meta.locationName ?? t("warehouse.noLocation")}
      </span>
    </span>
  );

  return (
    <DictionaryRefField<StoragePlaceOptionMeta>
      label={label}
      value={value}
      onChange={onChange}
      fetchItems={fetchStoragePlaceOptions}
      queryKey={queryKeys.warehouse.storagePlaces()}
      renderOption={renderOption}
      error={error}
    />
  );
};
