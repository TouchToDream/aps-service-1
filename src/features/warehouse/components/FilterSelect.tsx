import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";
import { useFilterParams } from "@/widgets/table/hooks/useFilterParams.ts";

const ALL_VALUE = "__all__";

type FilterSelectOption = {
  value: string;
  label: string;
};

interface FilterSelectProps {
  filterKey: string;
  allLabel: string;
  options: FilterSelectOption[];
}

/** A table filter stored in the URL query (`?<filterKey>=<value>`). */
export const FilterSelect = ({
  filterKey,
  allLabel,
  options,
}: FilterSelectProps) => {
  const { filters, setFilter } = useFilterParams();

  return (
    <Select
      value={filters[filterKey] ?? ALL_VALUE}
      onValueChange={(val) =>
        setFilter(filterKey, val === ALL_VALUE ? "" : val)
      }
    >
      <SelectTrigger className="h-9 w-44 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
