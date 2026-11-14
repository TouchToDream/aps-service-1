import { Loader2, PenLine, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { WarehouseResultRow } from "@/features/warehouse/components/picker/WarehouseResultRow.tsx";
import { useWarehouseSearch } from "@/features/warehouse/hooks/useWarehouseSearch.ts";
import type {
  WarehouseSearchContext,
  WarehouseSearchResult,
} from "@/features/warehouse/types.ts";
import { Input } from "@/shared/components/ui/input.tsx";

interface WarehousePickerProps {
  /** Office of the order / quick sale — stock is shown for that office. */
  locationId: number | null;
  context: WarehouseSearchContext;
  onPick: (result: WarehouseSearchResult) => void;
  onManual: () => void;
}

/**
 * Every row stays clickable, even with zero or negative stock: the person
 * holding the thing can sell it even if the accounting lags behind.
 */
export const WarehousePicker = ({
  locationId,
  context,
  onPick,
  onManual,
}: WarehousePickerProps) => {
  const { t } = useTranslation();
  const { query, setQuery, results, isLoading, isFetching } =
    useWarehouseSearch({ locationId, context });

  return (
    // min-w-0: the dialog is a CSS grid — without it long (truncated) names
    // stretch the column past the dialog edge.
    <div className="flex min-w-0 flex-col gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("warehouse.picker.searchPlaceholder")}
          className="pl-9"
        />
        {isFetching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
      <ul className="flex max-h-80 flex-col overflow-y-auto rounded-md border">
        {!isLoading && results.length === 0 && (
          <li className="px-3 py-2 text-sm text-muted-foreground">
            {t("warehouse.picker.empty")}
          </li>
        )}
        {results.map((result) => (
          <li key={`${result.source}-${result.id}`} className="border-b">
            <button
              type="button"
              onClick={() => onPick(result)}
              className="w-full px-3 py-2 text-left transition-colors hover:bg-muted"
            >
              <WarehouseResultRow result={result} />
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={onManual}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-primary transition-colors hover:bg-muted"
          >
            <PenLine className="h-4 w-4" />
            {t("warehouse.picker.enterManually")}
          </button>
        </li>
      </ul>
    </div>
  );
};
