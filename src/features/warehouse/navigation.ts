const BASE = "/warehouse";

export const WAREHOUSE_LINKS = {
  root: () => BASE,
  showcase: () => `${BASE}/showcase`,
  supplies: () => `${BASE}/supplies`,
  item: (id: number) => `${BASE}/items/${id}`,
  donors: () => `${BASE}/donors`,
  donor: (id: number) => `${BASE}/donors/${id}`,
  parts: () => `${BASE}/donors/parts`,
} as const;
