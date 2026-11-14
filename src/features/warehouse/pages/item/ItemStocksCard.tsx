import { ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  InfoTable,
  type InfoTableColumn,
} from "@/features/orders/components/info-table/InfoTable.tsx";
import { StockQuantity } from "@/features/warehouse/components/StockQuantity.tsx";
import { isBelowMinimum } from "@/features/warehouse/lib/service.ts";
import {
  MANUAL_STOCK_REASONS,
  type ManualStockReason,
  type WarehouseItemDetail,
  type WarehouseStock,
} from "@/features/warehouse/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";

interface ItemStocksCardProps {
  item: WarehouseItemDetail;
  canManage: boolean;
  canSell: boolean;
  onMovement: (reason: ManualStockReason) => void;
  onSell: (locationId: number) => void;
}

export const ItemStocksCard = ({
  item,
  canManage,
  canSell,
  onMovement,
  onSell,
}: ItemStocksCardProps) => {
  const { t } = useTranslation();

  const columns: InfoTableColumn<WarehouseStock>[] = [
    {
      key: "location",
      label: t("warehouse.table.location"),
      render: (row) => row.location.name,
    },
    {
      key: "quantity",
      label: t("warehouse.table.quantity"),
      render: (row) => <StockQuantity quantity={row.quantity} />,
    },
    ...(canSell
      ? [
          {
            key: "sell",
            label: "",
            render: (row: WarehouseStock) => (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onSell(row.locationId)}
              >
                <ShoppingCart className="h-4 w-4" />
                {t("warehouse.item.sell")}
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <Card className="p-2 sm:p-6">
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">
            {t("warehouse.item.stocks")}
          </h2>
          {canManage && (
            <div className="flex flex-wrap gap-2">
              {Object.values(MANUAL_STOCK_REASONS).map((reason) => (
                <Button
                  key={reason}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onMovement(reason)}
                >
                  {t(`warehouse.stock.${reason}`)}
                </Button>
              ))}
            </div>
          )}
        </div>
        {item.stocks.length ? (
          <InfoTable columns={columns} data={item.stocks} />
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("warehouse.item.noStocks")}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {t("warehouse.item.total")}:{" "}
          <StockQuantity quantity={item.totalQuantity} className="text-base" />
          {isBelowMinimum(item) && (
            <span className="ml-2 font-medium text-destructive">
              {t("warehouse.item.lowStock")}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
};
