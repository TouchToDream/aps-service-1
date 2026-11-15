import { useTranslation } from "react-i18next";

import {
  InfoTable,
  type InfoTableColumn,
} from "@/features/orders/components/info-table/InfoTable.tsx";
import { getPartDisplayName } from "@/features/warehouse/lib/service.ts";
import type { DonorPart } from "@/features/warehouse/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";

interface DonorPartsCardProps {
  parts: DonorPart[];
  canManage: boolean;
  isDeleting: boolean;
  onAdd: () => void;
  onEdit: (part: DonorPart) => void;
  onDelete: (part: DonorPart) => void;
}

export const DonorPartsCard = ({
  parts,
  canManage,
  isDeleting,
  onAdd,
  onEdit,
  onDelete,
}: DonorPartsCardProps) => {
  const { t } = useTranslation();

  const columns: InfoTableColumn<DonorPart>[] = [
    {
      key: "name",
      label: t("warehouse.table.name"),
      render: (part) => getPartDisplayName(part),
    },
    {
      key: "category",
      label: t("warehouse.table.category"),
      render: (part) => part.category.name,
    },
    {
      key: "storagePlace",
      label: t("warehouse.table.storagePlace"),
      collapsible: true,
      render: (part) => part.storagePlace?.name ?? "—",
    },
  ];

  return (
    <Card className="p-2 sm:p-6">
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">
            {t("warehouse.donor.parts")}
          </h2>
          {canManage && (
            <Button type="button" variant="outline" size="sm" onClick={onAdd}>
              {t("warehouse.donor.addPart")}
            </Button>
          )}
        </div>
        {parts.length ? (
          <InfoTable
            columns={columns}
            data={parts}
            onRowClick={canManage ? onEdit : undefined}
            onDelete={canManage ? onDelete : undefined}
            isDeleting={isDeleting}
            deleteDialogTitle={t("warehouse.part.deleteTitle")}
            deleteDialogDescription={t("warehouse.part.deleteDescription")}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("warehouse.donor.noParts")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
