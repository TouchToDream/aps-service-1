import { Archive, Pencil } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { warehouseApi } from "@/features/warehouse/api";
import { DonorFormDialog } from "@/features/warehouse/components/donor-form/DonorFormDialog.tsx";
import { DonorTitle } from "@/features/warehouse/components/DonorTitle.tsx";
import { PartFormDialog } from "@/features/warehouse/components/part-form/PartFormDialog.tsx";
import { DonorStatusBadge } from "@/features/warehouse/components/StatusBadges.tsx";
import { useCanManageWarehouse } from "@/features/warehouse/hooks/useCanManageWarehouse.ts";
import { useDeleteWarehouseEntity } from "@/features/warehouse/hooks/useDeleteWarehouseEntity.ts";
import { useDonor } from "@/features/warehouse/hooks/useDonor.ts";
import { WAREHOUSE_LINKS } from "@/features/warehouse/navigation.ts";
import { DonorInfoCard } from "@/features/warehouse/pages/donor/DonorInfoCard.tsx";
import { DonorPartsCard } from "@/features/warehouse/pages/donor/DonorPartsCard.tsx";
import type { DonorPart } from "@/features/warehouse/types.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";
import NotFoundPage from "@/shared/components/errors/NotFound.tsx";
import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { DeleteConfirmDialog } from "@/widgets/table/components/dialogs";

type DonorDialog =
  | { type: "edit" }
  | { type: "dispose" }
  | { type: "part"; part?: DonorPart }
  | null;

interface DonorPageContentProps {
  donorId: number;
}

const DonorPageContent = ({ donorId }: DonorPageContentProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = useCanManageWarehouse();
  const [dialog, setDialog] = useState<DonorDialog>(null);
  const { donor, isLoading, isError, error, refetch } = useDonor(donorId);
  // DELETE means "write off": the donor and its available parts become
  // disposed and the record is hidden; a swapped donor keeps its status.
  const { onDelete: disposeDonor, isPending: isDisposing } =
    useDeleteWarehouseEntity(
      warehouseApi.deleteDonor,
      () => navigate(WAREHOUSE_LINKS.donors()),
      "warehouse.donor.disposeSuccess",
    );
  const { onDelete: deletePart, isPending: isDeletingPart } =
    useDeleteWarehouseEntity(warehouseApi.deletePart);
  const defaultLocationId = donor?.location?.id ?? user?.location?.id ?? null;

  return (
    <QueryPageGuard
      isLoading={isLoading}
      loadingFallback={<Loader />}
      isError={isError}
      error={error}
      onRetry={refetch}
    >
      {donor && (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-2 sm:p-6 lg:max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <h1 className="text-lg font-bold break-words sm:text-2xl">
                <DonorTitle donor={donor} />
              </h1>
              <DonorStatusBadge status={donor.status} />
            </div>
            {canManage && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialog({ type: "edit" })}
                >
                  <Pencil className="h-4 w-4" />
                  {t("warehouse.donor.edit")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDialog({ type: "dispose" })}
                >
                  <Archive className="h-4 w-4" />
                  {t("warehouse.donor.dispose")}
                </Button>
              </div>
            )}
          </div>

          <DonorInfoCard donor={donor} />
          <DonorPartsCard
            parts={donor.parts}
            canManage={canManage}
            isDeleting={isDeletingPart}
            onAdd={() => setDialog({ type: "part" })}
            onEdit={(part) => setDialog({ type: "part", part })}
            onDelete={(part) => deletePart(part.id)}
          />

          {dialog?.type === "edit" && (
            <DonorFormDialog
              donor={donor}
              defaultLocationId={defaultLocationId}
              onClose={() => setDialog(null)}
            />
          )}
          {dialog?.type === "part" && (
            <PartFormDialog
              part={dialog.part}
              donorId={donor.id}
              defaultLocationId={defaultLocationId}
              onClose={() => setDialog(null)}
            />
          )}
          <DeleteConfirmDialog
            isOpen={dialog?.type === "dispose"}
            onOpenChange={(open) => !open && setDialog(null)}
            title={t("warehouse.donor.disposeTitle")}
            description={t("warehouse.donor.disposeDescription")}
            cancelLabel={t("common.cancel")}
            confirmLabel={t("warehouse.donor.dispose")}
            isPending={isDisposing}
            // Stay open while pending — success navigates to the donors list.
            onConfirm={() => disposeDonor(donor.id)}
          />
        </div>
      )}
    </QueryPageGuard>
  );
};

const DonorPage = () => {
  const { id } = useParams<{ id: string }>();
  const donorId = id ? Number.parseInt(id, 10) : Number.NaN;

  if (!Number.isFinite(donorId)) return <NotFoundPage />;

  return <DonorPageContent donorId={donorId} />;
};

export default DonorPage;
