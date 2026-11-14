import { useTranslation } from "react-i18next";

import { ClearFiltersButton } from "@/features/warehouse/components/ClearFiltersButton.tsx";
import { FilterSelect } from "@/features/warehouse/components/FilterSelect.tsx";
import { useLocationFilterOptions } from "@/features/warehouse/hooks/useLocationFilterOptions.ts";
import { useWarehouseCategories } from "@/features/warehouse/hooks/useWarehouseCategories.ts";
import { PARTS_FILTER_KEYS } from "@/features/warehouse/lib/constants.ts";
import { WAREHOUSE_CATEGORY_KINDS } from "@/features/warehouse/types.ts";

export const PartsFilterBar = () => {
  const { t } = useTranslation();
  const categories = useWarehouseCategories(WAREHOUSE_CATEGORY_KINDS.PART);
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
      <ClearFiltersButton filterKeys={PARTS_FILTER_KEYS} />
    </div>
  );
};
