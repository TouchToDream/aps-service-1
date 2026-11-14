import { ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  InfoTable,
  type InfoTableColumn,
} from "@/features/orders/components/info-table/InfoTable.tsx";
import { StockQuantity } from "@/features/warehouse/components/StockQuantity.tsx";
import { isShowcaseKind } from "@/features/warehouse/lib/service.ts";
import {
  MANUAL_STOCK_REASONS,
  type ManualStockReason,
  type WarehouseItemDetail,
  type WarehouseStock,
} from "@/features/warehouse/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";

/** InfoTable needs an id; a never-stocked office has none, so key by office. */
type StockRow = WarehouseStock & { id: number };

interface ItemStocksCardProps {
  item: WarehouseItemDetail;
  canManage: boolean;
  canSell: boolean;
  /** Row actions pass their office; the card-level correction passes null. */
  onMovement: (reason: ManualStockReason, stock: WarehouseStock | null) => void;
  onSell: (locationId: number) => void;
}

/**
 * Each office row has two actions: showcase — Purchase + Sell, supplies —
 * Purchase + Write off. One "Correction" per card (office picked inside).
 * Three reasons for one mechanic so the log tells bought / spent / re-counted.
 */
export const ItemStocksCard = ({
  item,
  canManage,
  canSell,
  onMovement,
  onSell,
}: ItemStocksCardProps) => {
  const { t } = useTranslation();
  const isShowcase = isShowcaseKind(item.kind);

  // Every office comes from the backend, zeros included — render them all.
  const rows: StockRow[] = item.stocks.map((stock) => ({
    ...stock,
    id: stock.locationId,
  }));

  const renderActions = (row: StockRow) => (
    <div className="flex justify-end gap-2">
      {canManage && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onMovement(MANUAL_STOCK_REASONS.PURCHASE, row)}
        >
          {t("warehouse.stock.purchase")}
        </Button>
      )}
      {isShowcase && canSell && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSell(row.locationId)}
        >
          <ShoppingCart className="h-4 w-4" />
          {t("warehouse.item.sell")}
        </Button>
      )}
      {!isShowcase && canManage && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onMovement(MANUAL_STOCK_REASONS.WRITEOFF, row)}
        >
          {t("warehouse.stock.writeoff")}
        </Button>
      )}
    </div>
  );

  const hasRowActions = canManage || (isShowcase && canSell);
  const columns: InfoTableColumn<StockRow>[] = [
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
    ...(hasRowActions
      ? [{ key: "actions", label: "", render: renderActions }]
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onMovement(MANUAL_STOCK_REASONS.CORRECTION, null)}
            >
              {t("warehouse.stock.correction")}
            </Button>
          )}
        </div>
        <InfoTable columns={columns} data={rows} />
        <p className="text-sm text-muted-foreground">
          {t("warehouse.item.total")}:{" "}
          <StockQuantity quantity={item.totalQuantity} className="text-base" />
        </p>
      </CardContent>
    </Card>
  );
};
