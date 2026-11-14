import { useTranslation } from "react-i18next";

import { ClearFiltersButton } from "@/features/warehouse/components/ClearFiltersButton.tsx";
import { FilterSelect } from "@/features/warehouse/components/FilterSelect.tsx";
import { useLocationFilterOptions } from "@/features/warehouse/hooks/useLocationFilterOptions.ts";
import { useWarehouseCategories } from "@/features/warehouse/hooks/useWarehouseCategories.ts";
import { PARTS_FILTER_KEYS } from "@/features/warehouse/lib/constants.ts";
import {
  PART_CONDITIONS,
  PART_STATUSES,
  WAREHOUSE_CATEGORY_KINDS,
} from "@/features/warehouse/types.ts";

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
        filterKey="condition"
        allLabel={t("warehouse.filters.allConditions")}
        options={Object.values(PART_CONDITIONS).map((condition) => ({
          value: condition,
          label: t(`warehouse.partConditions.${condition}`),
        }))}
      />
      <FilterSelect
        filterKey="status"
        allLabel={t("warehouse.filters.allStatuses")}
        options={Object.values(PART_STATUSES).map((status) => ({
          value: status,
          label: t(`warehouse.partStatuses.${status}`),
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
