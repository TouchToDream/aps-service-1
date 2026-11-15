import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ORDERS_LINKS } from "@/features/orders/navigation.ts";
import { InfoField } from "@/features/warehouse/components/InfoField.tsx";
import type { DonorDetail } from "@/features/warehouse/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";

interface DonorInfoCardProps {
  donor: DonorDetail;
}

interface OrderLinkProps {
  orderId: number;
}

const OrderLink = ({ orderId }: OrderLinkProps) => {
  const { t } = useTranslation();
  return (
    <Link
      to={ORDERS_LINKS.detail(orderId)}
      className="text-primary hover:underline"
    >
      {t("warehouse.stock.order", { id: orderId })}
    </Link>
  );
};

export const DonorInfoCard = ({ donor }: DonorInfoCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="p-2 sm:p-6">
      <CardContent className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        <InfoField label={t("warehouse.donor.fields.manufacturer")}>
          {donor.manufacturer}
        </InfoField>
        <InfoField label={t("warehouse.donor.fields.deviceType")}>
          {donor.deviceType}
        </InfoField>
        <InfoField label={t("warehouse.donor.fields.deviceModel")}>
          {donor.deviceModel}
        </InfoField>
        <InfoField label={t("warehouse.donor.fields.location")}>
          {donor.location?.name}
        </InfoField>
        <InfoField label={t("warehouse.donor.fields.storagePlace")}>
          {donor.storagePlace?.name}
        </InfoField>
        <InfoField label={t("warehouse.donor.fields.acquisitionCost")}>
          {donor.acquisitionCost !== null && (
            <MoneyAmount value={donor.acquisitionCost} />
          )}
        </InfoField>
        {donor.origin && (
          <InfoField label={t("warehouse.donor.fields.origin")}>
            {donor.origin}
          </InfoField>
        )}
        {/* Set by the system when the donor was born from an order. */}
        {donor.sourceOrderId !== null && (
          <InfoField label={t("warehouse.donor.sourceOrder")}>
            <OrderLink orderId={donor.sourceOrderId} />
          </InfoField>
        )}
        {donor.soldInOrderId !== null && (
          <InfoField label={t("warehouse.donor.soldInOrder")}>
            <OrderLink orderId={donor.soldInOrderId} />
          </InfoField>
        )}
        <InfoField label={t("warehouse.donor.fields.supplier")}>
          {donor.supplier?.name}
        </InfoField>
        {donor.note && (
          <InfoField label={t("warehouse.donor.fields.note")}>
            {donor.note}
          </InfoField>
        )}
      </CardContent>
    </Card>
  );
};
