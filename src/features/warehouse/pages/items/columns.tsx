import { PhotoThumb } from "@/features/warehouse/components/PhotoThumb.tsx";
import { StockQuantity } from "@/features/warehouse/components/StockQuantity.tsx";
import { isBelowMinimum } from "@/features/warehouse/lib/service.ts";
import type {
  StoragePlace,
  WarehouseCategory,
  WarehouseItem,
} from "@/features/warehouse/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { cn } from "@/shared/lib/utils.ts";
import { type ColumnConfig } from "@/widgets/table/models/types.ts";

export function buildWarehouseItemColumns(): ColumnConfig<WarehouseItem>[] {
  return [
    {
      key: "photoUrl",
      field: "photoUrl",
      labelKey: "warehouse.table.photo",
      sortable: false,
      className: "w-14",
      renderCell: (_value, item) => (
        <PhotoThumb url={item.photoUrl} alt={item.name} />
      ),
    },
    {
      key: "name",
      field: "name",
      labelKey: "warehouse.table.name",
      sortable: true,
    },
    {
      key: "category",
      field: "category",
      labelKey: "warehouse.table.category",
      sortable: false,
      renderCell: (value) => (value as WarehouseCategory).name,
    },
    {
      key: "price",
      field: "price",
      labelKey: "warehouse.table.price",
      sortable: true,
      renderCell: (value) =>
        value === null ? "—" : <MoneyAmount value={value as string} />,
    },
    {
      key: "totalQuantity",
      field: "totalQuantity",
      labelKey: "warehouse.table.quantity",
      sortable: false,
      renderCell: (_value, item) => (
        <span
          className={cn(
            "inline-flex items-center gap-1",
            isBelowMinimum(item) && "rounded bg-destructive/10 px-1.5",
          )}
        >
          <StockQuantity quantity={item.totalQuantity} />
          {item.minQuantity !== null && (
            <span className="text-xs text-muted-foreground">
              / {item.minQuantity}
            </span>
          )}
        </span>
      ),
    },
    {
      key: "storagePlace",
      field: "storagePlace",
      labelKey: "warehouse.table.storagePlace",
      sortable: false,
      renderCell: (value) => (value as StoragePlace | null)?.name ?? "—",
    },
  ];
}
