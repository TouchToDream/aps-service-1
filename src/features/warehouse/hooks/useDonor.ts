import { useQuery } from "@tanstack/react-query";

import { warehouseApi } from "@/features/warehouse/api";
import type { DonorDetail } from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseDonorReturn = {
  donor: DonorDetail | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

export const useDonor = (id: number): UseDonorReturn => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.warehouse.donor(id),
    queryFn: () => warehouseApi.getDonor(id),
  });

  return { donor: data, isLoading, isError, error, refetch };
};
