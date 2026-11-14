import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

import { warehouseApi } from "@/features/warehouse/api";
import { InfoField } from "@/features/warehouse/components/InfoField.tsx";
import { PhotoThumb } from "@/features/warehouse/components/PhotoThumb.tsx";
import { PhotoUploadButton } from "@/features/warehouse/components/PhotoUploadButton.tsx";
import { usePhotoUpload } from "@/features/warehouse/hooks/usePhotoUpload.ts";
import type { WarehouseItemDetail } from "@/features/warehouse/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";

interface ItemInfoCardProps {
  item: WarehouseItemDetail;
  canManage: boolean;
}

export const ItemInfoCard = ({ item, canManage }: ItemInfoCardProps) => {
  const { t } = useTranslation();
  const { upload, isPending } = usePhotoUpload((file) =>
    warehouseApi.uploadItemPhoto(item.id, file),
  );

  return (
    <Card className="p-2 sm:p-6">
      <CardContent className="flex flex-col gap-4 p-0 sm:flex-row">
        <div className="flex flex-col items-start gap-2">
          <PhotoThumb
            url={item.photoUrl}
            alt={item.name}
            className="h-40 w-40"
          />
          {canManage && (
            <PhotoUploadButton
              hasPhoto={item.photoUrl !== null}
              isPending={isPending}
              onSelect={upload}
            />
          )}
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoField label={t("warehouse.item.fields.category")}>
            {item.category.name}
          </InfoField>
          <InfoField label={t("warehouse.item.fields.price")}>
            {item.price !== null && <MoneyAmount value={item.price} />}
          </InfoField>
          <InfoField label={t("warehouse.item.fields.purchasePrice")}>
            {item.purchasePrice !== null ? (
              <MoneyAmount value={item.purchasePrice} />
            ) : (
              <span className="text-sm font-normal text-destructive">
                {t("warehouse.item.purchasePriceHint")}
              </span>
            )}
          </InfoField>
          <InfoField label={t("warehouse.item.fields.supplier")}>
            {item.supplier?.name}
          </InfoField>
          <InfoField label={t("warehouse.item.fields.unit")}>
            {t(`warehouse.units.${item.unit}`)}
          </InfoField>
          {item.orderUrl && (
            <InfoField label={t("warehouse.item.fields.orderUrl")}>
              <a
                href={item.orderUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {t("warehouse.item.buyMore")}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </InfoField>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
