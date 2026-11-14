import type { DonorSchema } from "@/features/warehouse/lib/donor.schema.ts";
import type { WarehouseItemSchema } from "@/features/warehouse/lib/item.schema.ts";
import type { DonorPartSchema } from "@/features/warehouse/lib/part.schema.ts";
import {
  type DictionaryRef,
  type Donor,
  DONOR_STATUSES,
  type DonorPart,
  type DonorShort,
  type DonorStatus,
  MANUAL_STOCK_REASONS,
  type ManualStockReason,
  type NewDonor,
  type NewDonorPart,
  type NewWarehouseItem,
  PART_CONDITIONS,
  PART_STATUSES,
  WAREHOUSE_ITEM_KINDS,
  WAREHOUSE_SOURCES,
  WAREHOUSE_UNITS,
  type WarehouseItem,
  type WarehouseItemKind,
  type WarehouseLineSource,
  type WarehouseSearchResult,
} from "@/features/warehouse/types.ts";
import { assertNever } from "@/shared/lib/assertNever.ts";

const EMPTY_REF: DictionaryRef = { id: null, name: "" };

// ── Generic helpers ─────────────────────────────────────────────────────────

export function filterByName<T extends { name: string }>(
  items: readonly T[],
  search: string,
): T[] {
  const needle = search.trim().toLocaleLowerCase();
  if (!needle) return [...items];
  return items.filter((item) => item.name.toLocaleLowerCase().includes(needle));
}

function toRef(entity: { id: number; name: string } | null): DictionaryRef {
  return entity ? { id: entity.id, name: entity.name } : EMPTY_REF;
}

function toOptionalNumber(value: string): number | null {
  return value ? Number(value) : null;
}

// ── Display ─────────────────────────────────────────────────────────────────

/** "Lenovo Ноутбук IdeaPad 3", or null when the donor has no device data at all. */
export function getDonorTitle(donor: DonorShort): string | null {
  const parts = [donor.manufacturer, donor.deviceType, donor.deviceModel]
    .map((part) => part?.trim())
    .filter(Boolean);
  return parts.length ? parts.join(" ") : null;
}

/** A nameless part is shown by its category name. */
export function getPartDisplayName(part: DonorPart): string {
  return part.name || part.category.name;
}

export function isBelowMinimum(item: WarehouseItem): boolean {
  return item.minQuantity !== null && item.totalQuantity < item.minQuantity;
}

/**
 * Purchase and write-off are entered as a positive amount and get their sign
 * from the action; a correction is entered already signed (+5 / -2).
 */
export function getSignedStockQuantity(
  reason: ManualStockReason,
  quantity: number,
): number {
  switch (reason) {
    case MANUAL_STOCK_REASONS.PURCHASE:
      return Math.abs(quantity);
    case MANUAL_STOCK_REASONS.WRITEOFF:
      return -Math.abs(quantity);
    case MANUAL_STOCK_REASONS.CORRECTION:
      return quantity;
    default:
      return assertNever(reason);
  }
}

/** Only a donor that already reached `given_to_customer` may show that status. */
export function getSelectableDonorStatuses(
  current: DonorStatus | null,
): DonorStatus[] {
  if (current === DONOR_STATUSES.GIVEN_TO_CUSTOMER) {
    return [DONOR_STATUSES.GIVEN_TO_CUSTOMER];
  }
  return Object.values(DONOR_STATUSES).filter(
    (status) => status !== DONOR_STATUSES.GIVEN_TO_CUSTOMER,
  );
}

export function getWarehouseLineSource(
  result: Pick<WarehouseSearchResult, "source" | "id">,
): WarehouseLineSource {
  return result.source === WAREHOUSE_SOURCES.DONOR_PART
    ? { warehouseItemId: null, donorPartId: result.id }
    : { warehouseItemId: result.id, donorPartId: null };
}

export function isDonorPartSource(
  result: Pick<WarehouseSearchResult, "source">,
): boolean {
  return result.source === WAREHOUSE_SOURCES.DONOR_PART;
}

// ── Item form ───────────────────────────────────────────────────────────────

export function getWarehouseItemFormDefaults(
  kind: WarehouseItemKind,
  item?: WarehouseItem,
): WarehouseItemSchema {
  if (!item) {
    return {
      kind,
      category: EMPTY_REF,
      name: "",
      price: "",
      purchasePrice: "",
      supplierName: "",
      orderUrl: "",
      unit: WAREHOUSE_UNITS.PIECE,
      minQuantity: "",
      storagePlace: EMPTY_REF,
    };
  }
  return {
    kind: item.kind,
    category: toRef(item.category),
    name: item.name,
    price: item.price ?? "",
    purchasePrice: item.purchasePrice ?? "",
    supplierName: item.supplier?.name ?? "",
    orderUrl: item.orderUrl ?? "",
    unit: item.unit,
    minQuantity: item.minQuantity === null ? "" : String(item.minQuantity),
    storagePlace: toRef(item.storagePlace),
  };
}

export function mapWarehouseItemFormToNewItem(
  values: WarehouseItemSchema,
): NewWarehouseItem {
  return {
    kind: values.kind,
    category: values.category,
    name: values.name,
    price: values.price,
    purchasePrice: values.purchasePrice,
    supplierName: values.supplierName,
    orderUrl: values.orderUrl,
    unit: values.unit,
    minQuantity: toOptionalNumber(values.minQuantity),
    storagePlace: values.storagePlace,
  };
}

export function isShowcaseKind(kind: WarehouseItemKind): boolean {
  return kind === WAREHOUSE_ITEM_KINDS.SHOWCASE;
}

// ── Donor form ──────────────────────────────────────────────────────────────

export function getDonorFormDefaults(
  donor: Donor | undefined,
  defaultLocationId: number | null,
): Partial<DonorSchema> {
  if (!donor) {
    return {
      manufacturer: "",
      deviceType: "",
      deviceModel: "",
      sourceOrderId: "",
      acquisitionCost: "",
      status: DONOR_STATUSES.AVAILABLE,
      storagePlace: EMPTY_REF,
      locationId: defaultLocationId ?? undefined,
      note: "",
    };
  }
  return {
    manufacturer: donor.manufacturer ?? "",
    deviceType: donor.deviceType ?? "",
    deviceModel: donor.deviceModel ?? "",
    sourceOrderId:
      donor.sourceOrderId === null ? "" : String(donor.sourceOrderId),
    acquisitionCost: donor.acquisitionCost ?? "",
    status: donor.status,
    storagePlace: toRef(donor.storagePlace),
    locationId: donor.location?.id ?? defaultLocationId ?? undefined,
    note: donor.note ?? "",
  };
}

/**
 * PUT replaces every field, so the form always sends the whole card. The
 * status is the exception: it is sent only when the user actually changed it.
 */
export function mapDonorFormToNewDonor(
  values: DonorSchema,
  donor?: Donor,
): NewDonor {
  const statusChanged = !donor || donor.status !== values.status;
  return {
    manufacturer: values.manufacturer,
    deviceType: values.deviceType,
    deviceModel: values.deviceModel,
    sourceOrderId: toOptionalNumber(values.sourceOrderId),
    supplierId: donor?.supplier?.id ?? null,
    acquisitionCost: values.acquisitionCost,
    status: statusChanged ? values.status : undefined,
    storagePlace: values.storagePlace,
    locationId: values.locationId,
    note: values.note,
  };
}

// ── Part form ───────────────────────────────────────────────────────────────

export function getDonorPartFormDefaults(
  part: DonorPart | undefined,
  donorId: number | null,
  defaultLocationId: number | null,
): Partial<DonorPartSchema> {
  if (!part) {
    return {
      donorId,
      category: EMPTY_REF,
      name: "",
      condition: PART_CONDITIONS.UNKNOWN,
      status: PART_STATUSES.AVAILABLE,
      storagePlace: EMPTY_REF,
      locationId: defaultLocationId ?? undefined,
      note: "",
    };
  }
  return {
    donorId: part.donor?.id ?? null,
    category: toRef(part.category),
    name: part.name ?? "",
    condition: part.condition,
    status: part.status,
    storagePlace: toRef(part.storagePlace),
    locationId: part.location?.id ?? defaultLocationId ?? undefined,
    note: part.note ?? "",
  };
}

export function mapDonorPartFormToNewPart(
  values: DonorPartSchema,
): NewDonorPart {
  return {
    donorId: values.donorId,
    category: values.category,
    name: values.name,
    condition: values.condition,
    status: values.status,
    storagePlace: values.storagePlace,
    locationId: values.locationId,
    note: values.note,
  };
}

// ── Server errors ───────────────────────────────────────────────────────────

const SOURCE_ERROR_KEY = /(^|\.)(warehouse_item_id|donor_part_id)$/;

/**
 * Validation messages about the warehouse source of a line (part already used,
 * both sources passed, single-piece quantity…), matched both as a plain key
 * and nested (`products.0.donor_part_id`). Null when there are none.
 */
export function getWarehouseSourceErrorMessage(
  errors: Record<string, string[]> | undefined,
): string | null {
  if (!errors) return null;
  const messages = Object.entries(errors)
    .filter(([key]) => SOURCE_ERROR_KEY.test(key))
    .flatMap(([, list]) => list);
  return messages.length ? messages.join(" ") : null;
}
