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
export const ITEMS_FILTER_KEYS = ["category_id", "location_id"] as const;

export const DONORS_FILTER_KEYS = ["location_id"] as const;

export const PARTS_FILTER_KEYS = ["category_id", "location_id"] as const;

/**
 * "+ product" dialog with the Manual / From warehouse tabs: one fixed width
 * and one fixed height for both tabs, so switching them never resizes the
 * window. It stays centred like every other dialog (no custom positioning).
 * A flex column instead of the default grid: header and tabs keep their
 * height, the warehouse list stretches to the bottom; taller content scrolls.
 */
export const ADD_PRODUCT_DIALOG_CLASS =
  "sm:max-w-2xl h-[min(44rem,90vh)] flex flex-col overflow-y-auto";
