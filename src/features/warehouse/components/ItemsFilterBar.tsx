import { useTranslation } from "react-i18next";

import { ClearFiltersButton } from "@/features/warehouse/components/ClearFiltersButton.tsx";
import { FilterSelect } from "@/features/warehouse/components/FilterSelect.tsx";
import { useLocationFilterOptions } from "@/features/warehouse/hooks/useLocationFilterOptions.ts";
import { useWarehouseCategories } from "@/features/warehouse/hooks/useWarehouseCategories.ts";
import { ITEMS_FILTER_KEYS } from "@/features/warehouse/lib/constants.ts";
import type { WarehouseItemKind } from "@/features/warehouse/types.ts";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import { useFilterParams } from "@/widgets/table/hooks/useFilterParams.ts";

interface ItemsFilterBarProps {
  kind: WarehouseItemKind;
}

export const ItemsFilterBar = ({ kind }: ItemsFilterBarProps) => {
  const { t } = useTranslation();
  const { filters, setFilter } = useFilterParams();
  const categories = useWarehouseCategories(kind);
  const locationOptions = useLocationFilterOptions();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect
        filterKey="category_id"
        allLabel={t("warehouse.filters.allCategories")}
        options={categories.map((c) => ({
          value: String(c.id),
          label: c.name,
        }))}
      />
      <FilterSelect
        filterKey="location_id"
        allLabel={t("warehouse.filters.allLocations")}
        options={locationOptions}
      />
      <label className="flex cursor-pointer items-center gap-1.5 text-sm">
        <Checkbox
          checked={filters.low_stock === "1"}
          onCheckedChange={(checked) =>
            setFilter("low_stock", checked ? "1" : "")
          }
        />
        {t("warehouse.filters.lowStock")}
      </label>
      <ClearFiltersButton filterKeys={ITEMS_FILTER_KEYS} />
    </div>
  );
};
