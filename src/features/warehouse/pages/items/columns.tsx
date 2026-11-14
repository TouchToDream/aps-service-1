import { PhotoThumb } from "@/features/warehouse/components/PhotoThumb.tsx";
import { StockQuantity } from "@/features/warehouse/components/StockQuantity.tsx";
import type {
  WarehouseCategory,
  WarehouseItem,
} from "@/features/warehouse/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
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
        <StockQuantity quantity={item.totalQuantity} />
      ),
    },
  ];
}
