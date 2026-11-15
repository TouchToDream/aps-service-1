import { useTranslation } from "react-i18next";

import { toggleSource } from "@/features/warehouse/lib/service.ts";
import {
  WAREHOUSE_SOURCES,
  type WarehouseSource,
} from "@/features/warehouse/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";

interface WarehouseSourceFilterProps {
  value: WarehouseSource[];
  onChange: (sources: WarehouseSource[]) => void;
}

/** Independent toggles; none switched on means "show everything". */
export const WarehouseSourceFilter = ({
  value,
  onChange,
}: WarehouseSourceFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      {Object.values(WAREHOUSE_SOURCES).map((source) => {
        const isOn = value.includes(source);
        return (
          <Button
            key={source}
            type="button"
            size="sm"
            variant={isOn ? "default" : "outline"}
            aria-pressed={isOn}
            onClick={() => onChange(toggleSource(value, source))}
          >
            {t(`warehouse.picker.sourceFilters.${source}`)}
          </Button>
        );
      })}
    </div>
  );
};
