import type { Location } from "@/entities/location/types.ts";
import type { Supplier } from "@/features/dictionaries/types.ts";
import type { User } from "@/features/users/types.ts";

// ── Fixed value sets ────────────────────────────────────────────────────────

export const WAREHOUSE_ITEM_KINDS = {
  SHOWCASE: "showcase",
  SUPPLY: "supply",
} as const;
export type WarehouseItemKind =
  (typeof WAREHOUSE_ITEM_KINDS)[keyof typeof WAREHOUSE_ITEM_KINDS];

export const WAREHOUSE_CATEGORY_KINDS = {
  ...WAREHOUSE_ITEM_KINDS,
  PART: "part",
} as const;
export type WarehouseCategoryKind =
  (typeof WAREHOUSE_CATEGORY_KINDS)[keyof typeof WAREHOUSE_CATEGORY_KINDS];

export const WAREHOUSE_UNITS = {
  PIECE: "piece",
  ML: "ml",
  G: "g",
  PACK: "pack",
} as const;
export type WarehouseUnit =
  (typeof WAREHOUSE_UNITS)[keyof typeof WAREHOUSE_UNITS];

export const STOCK_MOVEMENT_REASONS = {
  PURCHASE: "purchase",
  SALE: "sale",
  ORDER: "order",
  WRITEOFF: "writeoff",
  CORRECTION: "correction",
  RETURN: "return",
} as const;
export type StockMovementReason =
  (typeof STOCK_MOVEMENT_REASONS)[keyof typeof STOCK_MOVEMENT_REASONS];

/** Reasons a user can pick by hand on the item card (the rest are system-made). */
export const MANUAL_STOCK_REASONS = {
  PURCHASE: STOCK_MOVEMENT_REASONS.PURCHASE,
  WRITEOFF: STOCK_MOVEMENT_REASONS.WRITEOFF,
  CORRECTION: STOCK_MOVEMENT_REASONS.CORRECTION,
} as const;
export type ManualStockReason =
  (typeof MANUAL_STOCK_REASONS)[keyof typeof MANUAL_STOCK_REASONS];

export const DONOR_STATUSES = {
  AVAILABLE: "available",
  DISASSEMBLING: "disassembling",
  GIVEN_TO_CUSTOMER: "given_to_customer",
  DISPOSED: "disposed",
} as const;
export type DonorStatus = (typeof DONOR_STATUSES)[keyof typeof DONOR_STATUSES];

export const PART_CONDITIONS = {
  ALIVE: "alive",
  UNKNOWN: "unknown",
  DEAD: "dead",
} as const;
export type PartCondition =
  (typeof PART_CONDITIONS)[keyof typeof PART_CONDITIONS];

export const PART_STATUSES = {
  AVAILABLE: "available",
  USED: "used",
  SOLD: "sold",
  DISPOSED: "disposed",
} as const;
export type PartStatus = (typeof PART_STATUSES)[keyof typeof PART_STATUSES];

export const WAREHOUSE_SOURCES = {
  SHOWCASE: "showcase",
  SUPPLY: "supply",
  DONOR_PART: "donor_part",
} as const;
export type WarehouseSource =
  (typeof WAREHOUSE_SOURCES)[keyof typeof WAREHOUSE_SOURCES];

export const WAREHOUSE_SEARCH_CONTEXTS = {
  ORDER: "order",
  QUICK_ORDER: "quick_order",
} as const;
export type WarehouseSearchContext =
  (typeof WAREHOUSE_SEARCH_CONTEXTS)[keyof typeof WAREHOUSE_SEARCH_CONTEXTS];

// ── Dictionaries ────────────────────────────────────────────────────────────

export type WarehouseCategory = {
  id: number;
  name: string;
  kind: WarehouseCategoryKind;
};

export type StoragePlace = {
  id: number;
  name: string;
  locationId: number | null;
};

// ── Items (showcase / supplies) ─────────────────────────────────────────────

export type WarehouseStock = {
  id: number;
  locationId: number;
  location: Location;
  quantity: number;
};

export type StockMovement = {
  id: number;
  location: Location | null;
  delta: number;
  reason: StockMovementReason;
  orderId: number | null;
  quickOrderId: number | null;
  orderProductId: number | null;
  user: User | null;
  note: string | null;
  createdAt: string;
};

export type WarehouseItem = {
  id: number;
  kind: WarehouseItemKind;
  category: WarehouseCategory;
  name: string;
  price: string | null;
  purchasePrice: string | null;
  supplier: Supplier | null;
  orderUrl: string | null;
  unit: WarehouseUnit;
  minQuantity: number | null;
  storagePlace: StoragePlace | null;
  photoUrl: string | null;
  stocks: WarehouseStock[];
  totalQuantity: number;
};

export type WarehouseItemDetail = WarehouseItem & {
  movements: StockMovement[];
  createdAt: string;
  updatedAt: string;
};

/** "Pick existing by id, or type a new name" — used by the on-the-fly dictionaries. */
export type DictionaryRef = {
  id: number | null;
  name: string;
};

export type NewWarehouseItem = {
  kind: WarehouseItemKind;
  category: DictionaryRef;
  name: string;
  price: string;
  purchasePrice: string;
  supplierName: string;
  orderUrl: string;
  unit: WarehouseUnit;
  minQuantity: number | null;
  storagePlace: DictionaryRef;
};

export type NewStockMovement = {
  locationId: number;
  quantity: number;
  reason: ManualStockReason;
  note: string;
};

// ── Donors & parts ──────────────────────────────────────────────────────────

export type DonorShort = {
  id: number;
  manufacturer: string | null;
  deviceType: string | null;
  deviceModel: string | null;
};

export type Donor = DonorShort & {
  status: DonorStatus;
  storagePlace: StoragePlace | null;
  sourceOrderId: number | null;
  handedOverOrderId: number | null;
  supplier: Supplier | null;
  location: Location | null;
  acquisitionCost: string | null;
  note: string | null;
  partsCount: number;
};

export type DonorPart = {
  id: number;
  donor: DonorShort | null;
  category: WarehouseCategory;
  name: string | null;
  condition: PartCondition;
  status: PartStatus;
  storagePlace: StoragePlace | null;
  location: Location | null;
  note: string | null;
  photoUrl: string | null;
  usedInOrderId: number | null;
};

export type DonorDetail = Donor & {
  parts: DonorPart[];
  createdAt: string;
  updatedAt: string;
};

export type NewDonor = {
  manufacturer: string;
  deviceType: string;
  deviceModel: string;
  sourceOrderId: number | null;
  supplierId: number | null;
  acquisitionCost: string;
  /** Omitted on PUT keeps the current status (see backend rules). */
  status?: DonorStatus;
  storagePlace: DictionaryRef;
  locationId: number;
  note: string;
};

export type NewDonorPart = {
  donorId: number | null;
  category: DictionaryRef;
  name: string;
  condition: PartCondition;
  status: PartStatus;
  storagePlace: DictionaryRef;
  locationId: number;
  note: string;
};

export type DonorHandOver = {
  donorId: number;
  orderId: number;
  price: string;
  storagePlaceId: number;
  managerId: number;
};

// ── Unified "+ product" search ──────────────────────────────────────────────

export type WarehouseSearchResult = {
  source: WarehouseSource;
  id: number;
  name: string;
  category: WarehouseCategory;
  price: string | null;
  purchasePrice: string | null;
  quantity: number | null;
  storagePlace: StoragePlace | null;
  location: Location | null;
};

export type WarehouseSearchParams = {
  q: string;
  locationId: number | null;
  context: WarehouseSearchContext;
};

/** Which warehouse record a sold order/quick-order line points to. */
export type WarehouseLineSource =
  | { warehouseItemId: number; donorPartId: null }
  | { warehouseItemId: null; donorPartId: number };
