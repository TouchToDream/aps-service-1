import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { warehouseApi } from "@/features/warehouse/api";
import { DonorsViewSwitch } from "@/features/warehouse/components/DonorsViewSwitch.tsx";
import { PartFormDialog } from "@/features/warehouse/components/part-form/PartFormDialog.tsx";
import { PartsFilterBar } from "@/features/warehouse/components/PartsFilterBar.tsx";
import { WarehouseTabs } from "@/features/warehouse/components/WarehouseTabs.tsx";
import { useCanManageWarehouse } from "@/features/warehouse/hooks/useCanManageWarehouse.ts";
import { PARTS_FILTER_KEYS } from "@/features/warehouse/lib/constants.ts";
import { WAREHOUSE_LINKS } from "@/features/warehouse/navigation.ts";
import { buildDonorPartColumns } from "@/features/warehouse/pages/parts/columns.tsx";
import type { DonorPart } from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { AddButton } from "@/shared/components/AddButton.tsx";
import { SmartTable } from "@/widgets/table";

const columns = buildDonorPartColumns();
const api = { getAll: warehouseApi.getParts };

type PartDialog = { part?: DonorPart } | null;

/** All parts, including the ones without a donor and the historical ones. */
const PartsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = useCanManageWarehouse();
  const [dialog, setDialog] = useState<PartDialog>(null);

  const handleRowClick = (part: DonorPart) => {
    if (canManage) {
      setDialog({ part });
    } else if (part.donor) {
      navigate(WAREHOUSE_LINKS.donor(part.donor.id));
    }
  };

  return (
    <>
      <WarehouseTabs />
      <SmartTable
        titleKey="breadcrumbs.parts"
        api={api}
        queryKeyFn={queryKeys.warehouse.parts}
        columns={columns}
        searchField="search"
        searchPlaceholder="warehouse.search.parts"
        filterBar={
          <div className="flex flex-wrap items-center gap-2">
            <DonorsViewSwitch value="parts" />
            <PartsFilterBar />
          </div>
        }
        extraFilterKeys={[...PARTS_FILTER_KEYS]}
        onRowClick={handleRowClick}
        headerActions={
          canManage ? <AddButton onClick={() => setDialog({})} /> : undefined
        }
      />
      {dialog && (
        <PartFormDialog
          part={dialog.part}
          donorId={dialog.part?.donor?.id ?? null}
          defaultLocationId={user?.location?.id ?? null}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
};

export default PartsPage;
