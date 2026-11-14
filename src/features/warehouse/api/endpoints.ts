const BASE = "/backoffice/warehouse";

export const WAREHOUSE_API = {
  items: () => `${BASE}/items`,
  item: (id: number) => `${BASE}/items/${id}`,
  itemStock: (id: number) => `${BASE}/items/${id}/stock`,
  itemPhoto: (id: number) => `${BASE}/items/${id}/photo`,
  donors: () => `${BASE}/donors`,
  donor: (id: number) => `${BASE}/donors/${id}`,
  donorHandOver: (id: number) => `${BASE}/donors/${id}/hand-over`,
  parts: () => `${BASE}/parts`,
  part: (id: number) => `${BASE}/parts/${id}`,
  partPhoto: (id: number) => `${BASE}/parts/${id}/photo`,
  categories: () => `${BASE}/categories`,
  storagePlaces: () => `${BASE}/storage-places`,
  search: () => `${BASE}/search`,
  orderToDonor: (orderId: number) => `/backoffice/orders/${orderId}/to-donor`,
} as const;
