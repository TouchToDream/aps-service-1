import { IMAGE_COMPRESSION_OPTIONS } from "@/shared/lib/imageCompression.ts";

/** Backend accepts warehouse photos up to 2040 KB (2041 → 422). */
export const WAREHOUSE_PHOTO_MAX_BYTES = 2040 * 1024;

// The shared preset targets 2 MB (= 2048 KB), which is above the warehouse
// limit — compress a bit harder so the result always passes validation.
export const WAREHOUSE_PHOTO_COMPRESSION = {
  ...IMAGE_COMPRESSION_OPTIONS,
  maxSizeMB: 1.9,
} as const;

/** Default and maximum row count of the unified "+ product" search. */
export const WAREHOUSE_SEARCH_LIMIT = 50;

/** URL filter keys each warehouse table forwards to its list endpoint. */
export const ITEMS_FILTER_KEYS = [
  "category_id",
  "location_id",
  "low_stock",
] as const;

export const DONORS_FILTER_KEYS = ["status", "location_id"] as const;

export const PARTS_FILTER_KEYS = [
  "category_id",
  "condition",
  "status",
  "location_id",
] as const;
