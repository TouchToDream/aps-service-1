import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { warehouseApi } from "@/features/warehouse/api";
import type {
  WarehouseSearchContext,
  WarehouseSearchResult,
  WarehouseSource,
} from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { useDebounce } from "@/shared/hooks/useDebounce.ts";
import { SEARCH_DEBOUNCE_MS } from "@/shared/lib/constants.ts";

type UseWarehouseSearchParams = {
  locationId: number | null;
  context: WarehouseSearchContext;
};

type UseWarehouseSearchReturn = {
  query: string;
  setQuery: (value: string) => void;
  /** Source toggles; none switched on = all sources. */
  sources: WarehouseSource[];
  setSources: (sources: WarehouseSource[]) => void;
  results: WarehouseSearchResult[];
  isLoading: boolean;
  isFetching: boolean;
};

const NO_RESULTS: WarehouseSearchResult[] = [];

/**
 * Unified search over showcase, supplies and donor parts. The order is final
 * (relevance → source → "has stock here" → id) and must not be re-sorted;
 * zero/negative stock is returned on purpose and must not be filtered out.
 */
export const useWarehouseSearch = ({
  locationId,
  context,
}: UseWarehouseSearchParams): UseWarehouseSearchReturn => {
  const [query, setQuery] = useState("");
  const [sources, setSources] = useState<WarehouseSource[]>([]);
  const q = useDebounce(query.trim(), SEARCH_DEBOUNCE_MS);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.warehouse.search(q, locationId, context, sources),
    queryFn: () => warehouseApi.search({ q, locationId, context, sources }),
    // Stock moves with every sale — never pick from a stale list.
    staleTime: 0,
  });

  return {
    query,
    setQuery,
    sources,
    setSources,
    results: data ?? NO_RESULTS,
    isLoading,
    isFetching,
  };
};
