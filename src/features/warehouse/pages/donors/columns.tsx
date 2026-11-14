import { DonorTitle } from "@/features/warehouse/components/DonorTitle.tsx";
import { DonorStatusBadge } from "@/features/warehouse/components/StatusBadges.tsx";
import type { Donor } from "@/features/warehouse/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { type ColumnConfig } from "@/widgets/table/models/types.ts";

export function buildDonorColumns(): ColumnConfig<Donor>[] {
  return [
    {
      key: "id",
      field: "id",
      labelKey: "warehouse.table.id",
      sortable: true,
      className: "w-16",
    },
    {
      key: "deviceModel",
      field: "deviceModel",
      labelKey: "warehouse.table.device",
      sortable: true,
      sortKey: "device_model",
      renderCell: (_value, donor) => <DonorTitle donor={donor} />,
    },
    {
      key: "status",
      field: "status",
      labelKey: "warehouse.table.status",
      sortable: false,
      renderCell: (_value, donor) => <DonorStatusBadge status={donor.status} />,
    },
    {
      key: "partsCount",
      field: "partsCount",
      labelKey: "warehouse.table.partsCount",
      sortable: false,
    },
    {
      key: "location",
      field: "location",
      labelKey: "warehouse.table.location",
      sortable: false,
      renderCell: (_value, donor) => donor.location?.name ?? "—",
    },
    {
      key: "storagePlace",
      field: "storagePlace",
      labelKey: "warehouse.table.storagePlace",
      sortable: false,
      renderCell: (_value, donor) => donor.storagePlace?.name ?? "—",
    },
    {
      key: "acquisitionCost",
      field: "acquisitionCost",
      labelKey: "warehouse.donor.fields.acquisitionCost",
      sortable: false,
      renderCell: (_value, donor) =>
        donor.acquisitionCost === null ? (
          "—"
        ) : (
          <MoneyAmount value={donor.acquisitionCost} />
        ),
    },
  ];
}
