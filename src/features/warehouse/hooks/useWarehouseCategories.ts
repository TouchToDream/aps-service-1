import { useQuery } from "@tanstack/react-query";

import { warehouseApi } from "@/features/warehouse/api";
import type {
  WarehouseCategory,
  WarehouseCategoryKind,
} from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const NO_CATEGORIES: WarehouseCategory[] = [];

export const useWarehouseCategories = (
  kind: WarehouseCategoryKind,
): WarehouseCategory[] => {
  const { data } = useQuery({
    queryKey: queryKeys.warehouse.categories(kind),
    queryFn: () => warehouseApi.getCategories(kind),
  });
  return data ?? NO_CATEGORIES;
};
