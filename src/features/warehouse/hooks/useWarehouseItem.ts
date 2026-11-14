import { useQuery } from "@tanstack/react-query";

import { warehouseApi } from "@/features/warehouse/api";
import type { WarehouseItemDetail } from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseWarehouseItemReturn = {
  item: WarehouseItemDetail | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

export const useWarehouseItem = (id: number): UseWarehouseItemReturn => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.warehouse.item(id),
    queryFn: () => warehouseApi.getItem(id),
  });

  return { item: data, isLoading, isError, error, refetch };
};
