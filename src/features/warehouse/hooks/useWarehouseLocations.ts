import { useQuery } from "@tanstack/react-query";

import { locationApi } from "@/features/dictionaries/api";
import type { Location } from "@/features/dictionaries/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseWarehouseLocationsReturn = {
  locations: Location[];
  isLoadingLocations: boolean;
};

const NO_LOCATIONS: Location[] = [];

export const useWarehouseLocations = (): UseWarehouseLocationsReturn => {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.dictionaries.locations(),
    queryFn: () => locationApi.getAll(1, 100),
  });

  return {
    locations: data?.items ?? NO_LOCATIONS,
    isLoadingLocations: isLoading,
  };
};
