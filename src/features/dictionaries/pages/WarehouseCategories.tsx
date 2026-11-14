import { useMemo } from "react";

import { ABILITIES } from "@/features/auth/abilities.ts";
import { DictionaryTablePage } from "@/features/dictionaries/components/DictionaryTablePage.tsx";
import { warehouseApi } from "@/features/warehouse/api";
import { CategoryKindSwitch } from "@/features/warehouse/components/CategoryKindSwitch.tsx";
import {
  filterByName,
  parseCategoryKind,
  toSinglePageResponse,
} from "@/features/warehouse/lib/service.ts";
import type { WarehouseCategory } from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { useFilterParams } from "@/widgets/table/hooks/useFilterParams.ts";
import type { ColumnConfig } from "@/widgets/table/models/types.ts";

const columns: ColumnConfig<WarehouseCategory>[] = [
  {
    key: "name",
    field: "name",
    labelKey: "dictionaries.table_fields.name",
    sortable: false,
  },
];

/**
 * Warehouse categories, managed by `warehouse_manage` (not by the dictionaries
 * permission); viewing is open. Deleting a category still in use returns 422
 * `category_in_use`, which is shown as is.
 */
const WarehouseCategoriesPage = () => {
  const { filters } = useFilterParams();
  const kind = parseCategoryKind(filters.kind);

  const api = useMemo(
    () => ({
      getAll: async (
        _page: number,
        _perPage: number,
        _sortColumn?: string | null,
        _sortType?: string,
        tableFilters?: Record<string, string>,
      ) => {
        const categories = await warehouseApi.getCategories(kind);
        return toSinglePageResponse(
          filterByName(categories, tableFilters?.name ?? ""),
        );
      },
      create: (values: Partial<WarehouseCategory>) =>
        warehouseApi.createCategory(values.name ?? "", kind),
      update: (id: number, values: Partial<WarehouseCategory>) =>
        warehouseApi.renameCategory(id, values.name ?? ""),
      remove: warehouseApi.deleteCategory,
    }),
    [kind],
  );

  return (
    <DictionaryTablePage
      titleKey="sidebar.dictionaries_list.warehouse_categories"
      api={api}
      queryKeyFn={queryKeys.warehouse.categoryList}
      columns={columns}
      filterBar={<CategoryKindSwitch value={kind} />}
      extraFilterKeys={["kind"]}
      manageAbility={ABILITIES.WAREHOUSE_MANAGE}
    />
  );
};

export default WarehouseCategoriesPage;
