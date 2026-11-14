import type { ReactNode } from "react";

import type { DictionaryRef } from "@/features/warehouse/types.ts";
import { Label } from "@/shared/components/ui/label.tsx";
import SearchableSelect, {
  type SearchableSelectOption,
} from "@/widgets/searchable-select";

interface DictionaryRefFieldProps<TMeta = undefined> {
  label: string;
  value: DictionaryRef;
  onChange: (value: DictionaryRef) => void;
  fetchItems: (search: string) => Promise<SearchableSelectOption<TMeta>[]>;
  queryKey: readonly unknown[];
  renderOption?: (option: SearchableSelectOption<TMeta>) => ReactNode;
  error?: string;
  disabled?: boolean;
}

/**
 * Combobox for the on-the-fly dictionaries (categories, storage places):
 * picking an option sends its id, typing free text sends a new name that the
 * backend finds or creates.
 */
export const DictionaryRefField = <TMeta = undefined,>({
  label,
  value,
  onChange,
  fetchItems,
  queryKey,
  renderOption,
  error,
  disabled,
}: DictionaryRefFieldProps<TMeta>) => (
  <div className="flex flex-col gap-1">
    <Label>{label}</Label>
    <SearchableSelect<TMeta>
      value={value.name}
      onChange={(name) => onChange({ id: null, name })}
      onSelect={(option) => onChange({ id: option.id, name: option.name })}
      fetchItems={fetchItems}
      queryKey={queryKey}
      renderOption={renderOption}
      disabled={disabled}
      // SearchableSelect renders the message itself (red border + text).
      error={error ? { type: "validate", message: error } : undefined}
    />
  </div>
);
