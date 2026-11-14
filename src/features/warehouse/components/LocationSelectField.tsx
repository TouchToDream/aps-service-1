import { useTranslation } from "react-i18next";

import { useWarehouseLocations } from "@/features/warehouse/hooks/useWarehouseLocations.ts";
import { Label } from "@/shared/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

interface LocationSelectFieldProps {
  label: string;
  value: number | undefined;
  onChange: (locationId: number) => void;
  error?: string;
}

export const LocationSelectField = ({
  label,
  value,
  onChange,
  error,
}: LocationSelectFieldProps) => {
  const { t } = useTranslation();
  const { locations, isLoadingLocations } = useWarehouseLocations();

  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Select
        value={value ? String(value) : ""}
        onValueChange={(val) => onChange(Number(val))}
        disabled={isLoadingLocations}
      >
        <SelectTrigger className={error ? "border-destructive" : undefined}>
          <SelectValue
            placeholder={isLoadingLocations ? t("loader.default") : "..."}
          />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location.id} value={String(location.id)}>
              {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
