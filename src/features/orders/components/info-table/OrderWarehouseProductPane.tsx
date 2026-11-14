import { useState } from "react";

import { OrderWarehouseLineForm } from "@/features/orders/components/info-table/OrderWarehouseLineForm.tsx";
import { PickerFooter } from "@/features/warehouse/components/picker/PickerFooter.tsx";
import { WarehousePicker } from "@/features/warehouse/components/picker/WarehousePicker.tsx";
import {
  WAREHOUSE_SEARCH_CONTEXTS,
  type WarehouseSearchResult,
} from "@/features/warehouse/types.ts";

interface OrderWarehouseProductPaneProps {
  orderId: number;
  locationId: number | null;
  onManual: () => void;
  onClose: () => void;
}

/** "+ product" → "From warehouse": pick a row, then set price/quantity/executor. */
export const OrderWarehouseProductPane = ({
  orderId,
  locationId,
  onManual,
  onClose,
}: OrderWarehouseProductPaneProps) => {
  const [picked, setPicked] = useState<WarehouseSearchResult | null>(null);

  if (!picked) {
    return (
      <>
        <WarehousePicker
          locationId={locationId}
          context={WAREHOUSE_SEARCH_CONTEXTS.ORDER}
          onPick={setPicked}
          onManual={onManual}
        />
        <PickerFooter onClose={onClose} />
      </>
    );
  }

  return (
    <OrderWarehouseLineForm
      key={`${picked.source}-${picked.id}`}
      orderId={orderId}
      result={picked}
      onBack={() => setPicked(null)}
      onClose={onClose}
    />
  );
};
