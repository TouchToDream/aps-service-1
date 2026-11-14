import { useState } from "react";

import { QuickOrderWarehouseLineForm } from "@/features/quick-orders/components/QuickOrderWarehouseLineForm.tsx";
import type { NewQuickOrderItemSchema } from "@/features/quick-orders/lib/schema.ts";
import { PickerFooter } from "@/features/warehouse/components/picker/PickerFooter.tsx";
import { WarehousePicker } from "@/features/warehouse/components/picker/WarehousePicker.tsx";
import {
  WAREHOUSE_SEARCH_CONTEXTS,
  type WarehouseSearchResult,
} from "@/features/warehouse/types.ts";

interface QuickOrderWarehousePaneProps {
  locationId: number | null;
  onManual: () => void;
  onSave: (item: NewQuickOrderItemSchema) => void;
  onClose: () => void;
}

/** Donor parts are listed last in a quick sale (still available, rarely sold). */
export const QuickOrderWarehousePane = ({
  locationId,
  onManual,
  onSave,
  onClose,
}: QuickOrderWarehousePaneProps) => {
  const [picked, setPicked] = useState<WarehouseSearchResult | null>(null);

  if (!picked) {
    return (
      <>
        <WarehousePicker
          locationId={locationId}
          context={WAREHOUSE_SEARCH_CONTEXTS.QUICK_ORDER}
          onPick={setPicked}
          onManual={onManual}
        />
        <PickerFooter onClose={onClose} />
      </>
    );
  }

  return (
    <QuickOrderWarehouseLineForm
      key={`${picked.source}-${picked.id}`}
      result={picked}
      onBack={() => setPicked(null)}
      onSave={onSave}
      onClose={onClose}
    />
  );
};
