import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useFilterParams } from "@/widgets/table/hooks/useFilterParams.ts";

interface ClearFiltersButtonProps {
  filterKeys: readonly string[];
}

export const ClearFiltersButton = ({ filterKeys }: ClearFiltersButtonProps) => {
  const { t } = useTranslation();
  const { filters, setFilters } = useFilterParams();

  if (!filterKeys.some((key) => filters[key])) return null;

  return (
    <button
      type="button"
      onClick={() =>
        setFilters(Object.fromEntries(filterKeys.map((key) => [key, ""])))
      }
      aria-label={t("warehouse.filters.clear")}
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  );
};
