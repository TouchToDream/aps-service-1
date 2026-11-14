import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { warehouseApi } from "@/features/warehouse/api";
import { ItemFormDialog } from "@/features/warehouse/components/item-form/ItemFormDialog.tsx";
import { ItemsFilterBar } from "@/features/warehouse/components/ItemsFilterBar.tsx";
import { WarehouseTabs } from "@/features/warehouse/components/WarehouseTabs.tsx";
import { useCanManageWarehouse } from "@/features/warehouse/hooks/useCanManageWarehouse.ts";
import { ITEMS_FILTER_KEYS } from "@/features/warehouse/lib/constants.ts";
import { isShowcaseKind } from "@/features/warehouse/lib/service.ts";
import { WAREHOUSE_LINKS } from "@/features/warehouse/navigation.ts";
import { buildWarehouseItemColumns } from "@/features/warehouse/pages/items/columns.tsx";
import type {
  WarehouseItem,
  WarehouseItemKind,
} from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { AddButton } from "@/shared/components/AddButton.tsx";
import { SmartTable } from "@/widgets/table";
import type { SortType } from "@/widgets/table/hooks/useSortParams.ts";
import type { SmartTableApi } from "@/widgets/table/models/types.ts";

const columns = buildWarehouseItemColumns();

interface ItemsListPageProps {
  kind: WarehouseItemKind;
}

/** One table for both tabs, split by `kind` (showcase / supply). */
export const ItemsListPage = ({ kind }: ItemsListPageProps) => {
  const navigate = useNavigate();
  const canManage = useCanManageWarehouse();
  const [isCreating, setIsCreating] = useState(false);

  const api = useMemo<SmartTableApi<WarehouseItem>>(
    () => ({
      getAll: (page, perPage, sortColumn, sortType, filters) =>
        warehouseApi.getItems(page, perPage, sortColumn, sortType, {
          ...filters,
          kind,
        }),
    }),
    [kind],
  );

  const queryKeyFn = (
    page: number,
    perPage: number,
    sortColumn: string | null,
    sortType: SortType,
    filters: Record<string, string>,
  ) =>
    queryKeys.warehouse.items(page, perPage, sortColumn, sortType, {
      ...filters,
      kind,
    });

  return (
    <>
      <WarehouseTabs />
      <SmartTable
        key={kind}
        titleKey={
          isShowcaseKind(kind) ? "breadcrumbs.showcase" : "breadcrumbs.supplies"
        }
        api={api}
        queryKeyFn={queryKeyFn}
        columns={columns}
        searchField="search"
        searchPlaceholder="warehouse.search.items"
        filterBar={<ItemsFilterBar kind={kind} />}
        extraFilterKeys={[...ITEMS_FILTER_KEYS]}
        onRowClick={(item) => navigate(WAREHOUSE_LINKS.item(item.id))}
        headerActions={
          canManage ? (
            <AddButton onClick={() => setIsCreating(true)} />
          ) : undefined
        }
      />
      {isCreating && (
        <ItemFormDialog
          kind={kind}
          onClose={() => setIsCreating(false)}
          onSaved={(item) => navigate(WAREHOUSE_LINKS.item(item.id))}
        />
      )}
    </>
  );
};
