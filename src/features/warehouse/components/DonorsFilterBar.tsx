import { useTranslation } from "react-i18next";

import { ClearFiltersButton } from "@/features/warehouse/components/ClearFiltersButton.tsx";
import { FilterSelect } from "@/features/warehouse/components/FilterSelect.tsx";
import { useLocationFilterOptions } from "@/features/warehouse/hooks/useLocationFilterOptions.ts";
import { DONORS_FILTER_KEYS } from "@/features/warehouse/lib/constants.ts";
import { DONOR_STATUSES } from "@/features/warehouse/types.ts";

export const DonorsFilterBar = () => {
  const { t } = useTranslation();
  const locationOptions = useLocationFilterOptions();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect
        filterKey="status"
        allLabel={t("warehouse.filters.allStatuses")}
        options={Object.values(DONOR_STATUSES).map((status) => ({
          value: status,
          label: t(`warehouse.donorStatuses.${status}`),
        }))}
      />
      <FilterSelect
        filterKey="location_id"
        allLabel={t("warehouse.filters.allLocations")}
        options={locationOptions}
      />
      <ClearFiltersButton filterKeys={DONORS_FILTER_KEYS} />
    </div>
  );
};
