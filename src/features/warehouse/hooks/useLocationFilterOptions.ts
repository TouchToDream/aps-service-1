import { useMemo } from "react";

import { useWarehouseLocations } from "@/features/warehouse/hooks/useWarehouseLocations.ts";

type FilterOption = { value: string; label: string };

export const useLocationFilterOptions = (): FilterOption[] => {
  const { locations } = useWarehouseLocations();
  return useMemo(
    () =>
      locations.map((location) => ({
        value: String(location.id),
        label: location.name,
      })),
    [locations],
  );
};
