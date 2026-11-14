import { useTranslation } from "react-i18next";

import {
  WAREHOUSE_CATEGORY_KINDS,
  type WarehouseCategoryKind,
} from "@/features/warehouse/types.ts";
import SegmentedControl from "@/shared/components/SegmentedControl.tsx";
import { useFilterParams } from "@/widgets/table/hooks/useFilterParams.ts";

interface CategoryKindSwitchProps {
  value: WarehouseCategoryKind;
}

/** Categories are split by kind: showcase goods, supplies, donor parts. */
export const CategoryKindSwitch = ({ value }: CategoryKindSwitchProps) => {
  const { t } = useTranslation();
  const { setFilters } = useFilterParams();

  return (
    <div className="w-full max-w-md">
      <SegmentedControl<WarehouseCategoryKind>
        value={value}
        // Reset the name search too — names differ between kinds.
        onChange={(kind) => setFilters({ kind, name: "" })}
        options={Object.values(WAREHOUSE_CATEGORY_KINDS).map((kind) => ({
          value: kind,
          label: t(`warehouse.categories.kinds.${kind}`),
        }))}
      />
    </div>
  );
};
