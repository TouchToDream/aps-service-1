import { mapLocationDtoToLocation } from "@/entities/location/adapters.ts";
import { mapSupplierDtoToSupplier } from "@/features/dictionaries/lib/adapters.ts";
import { mapUserDtoToUser } from "@/features/users/lib/adapters.ts";
import type {
  DonorDetailDto,
  DonorDto,
  DonorPartDto,
  DonorShortDto,
  PaginatedDonorPartsDto,
  PaginatedDonorsDto,
  PaginatedWarehouseItemsDto,
  StockMovementDto,
  StoragePlaceDto,
  WarehouseCategoryDto,
  WarehouseItemDetailDto,
  WarehouseItemDto,
  WarehouseSearchResultDto,
  WarehouseStockDto,
} from "@/features/warehouse/api/dto.ts";
import type {
  DictionaryRef,
  Donor,
  DonorDetail,
  DonorHandOver,
  DonorPart,
  DonorShort,
  NewDonor,
  NewDonorPart,
  NewStockMovement,
  NewWarehouseItem,
  StockMovement,
  StoragePlace,
  WarehouseCategory,
  WarehouseItem,
  WarehouseItemDetail,
  WarehouseSearchResult,
  WarehouseStock,
} from "@/features/warehouse/types.ts";
import type { PaginatedResponse } from "@/widgets/table/models/types.ts";

// ── from dto ────────────────────────────────────────────────────────────────

export function mapWarehouseCategoryDto(
  dto: WarehouseCategoryDto,
): WarehouseCategory {
  return { id: dto.id, name: dto.name, kind: dto.kind };
}

export function mapStoragePlaceDto(dto: StoragePlaceDto): StoragePlace {
  return { id: dto.id, name: dto.name, locationId: dto.location_id };
}

function mapWarehouseStockDto(dto: WarehouseStockDto): WarehouseStock {
  return {
    locationId: dto.location_id,
    location: mapLocationDtoToLocation(dto.location),
    quantity: dto.quantity,
  };
}

function mapStockMovementDto(dto: StockMovementDto): StockMovement {
  return {
    id: dto.id,
    location: dto.location ? mapLocationDtoToLocation(dto.location) : null,
    delta: dto.delta,
    reason: dto.reason,
    orderId: dto.order_id,
    quickOrderId: dto.quick_order_id,
    orderProductId: dto.order_product_id,
    user: dto.user ? mapUserDtoToUser(dto.user) : null,
    note: dto.note,
    createdAt: dto.created_at,
  };
}

export function mapWarehouseItemDto(dto: WarehouseItemDto): WarehouseItem {
  return {
    id: dto.id,
    kind: dto.kind,
    category: mapWarehouseCategoryDto(dto.category),
    name: dto.name,
    price: dto.price,
    purchasePrice: dto.purchase_price,
    supplier: dto.supplier ? mapSupplierDtoToSupplier(dto.supplier) : null,
    orderUrl: dto.order_url,
    unit: dto.unit,
    photoUrl: dto.photo_url,
    stocks: dto.stocks.map(mapWarehouseStockDto),
    totalQuantity: dto.total_quantity,
  };
}

export function mapWarehouseItemDetailDto(
  dto: WarehouseItemDetailDto,
): WarehouseItemDetail {
  return {
    ...mapWarehouseItemDto(dto),
    movements: dto.movements.map(mapStockMovementDto),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapPaginatedWarehouseItemsDto(
  dto: PaginatedWarehouseItemsDto,
): PaginatedResponse<WarehouseItem> {
  return {
    items: dto.data.map(mapWarehouseItemDto),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
    },
  };
}

function mapDonorShortDto(dto: DonorShortDto): DonorShort {
  return {
    id: dto.id,
    manufacturer: dto.manufacturer,
    deviceType: dto.device_type,
    deviceModel: dto.device_model,
  };
}

export function mapDonorDto(dto: DonorDto): Donor {
  return {
    ...mapDonorShortDto(dto),
    storagePlace: dto.storage_place
      ? mapStoragePlaceDto(dto.storage_place)
      : null,
    sourceOrderId: dto.source_order_id,
    origin: dto.origin,
    handedOverOrderId: dto.handed_over_order_id,
    supplier: dto.supplier ? mapSupplierDtoToSupplier(dto.supplier) : null,
    location: dto.location ? mapLocationDtoToLocation(dto.location) : null,
    acquisitionCost: dto.acquisition_cost,
    note: dto.note,
    partsCount: dto.parts_count,
  };
}

export function mapDonorPartDto(dto: DonorPartDto): DonorPart {
  return {
    id: dto.id,
    donor: dto.donor ? mapDonorShortDto(dto.donor) : null,
    category: mapWarehouseCategoryDto(dto.category),
    name: dto.name,
    storagePlace: dto.storage_place
      ? mapStoragePlaceDto(dto.storage_place)
      : null,
    location: dto.location ? mapLocationDtoToLocation(dto.location) : null,
    note: dto.note,
    photoUrl: dto.photo_url,
    isAvailable: dto.is_available,
    usedInOrderId: dto.used_in_order_id,
    usedInQuickOrderId: dto.used_in_quick_order_id,
  };
}

export function mapDonorDetailDto(dto: DonorDetailDto): DonorDetail {
  return {
    ...mapDonorDto(dto),
    parts: dto.parts.map(mapDonorPartDto),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapPaginatedDonorsDto(
  dto: PaginatedDonorsDto,
): PaginatedResponse<Donor> {
  return {
    items: dto.data.map(mapDonorDto),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
    },
  };
}

export function mapPaginatedDonorPartsDto(
  dto: PaginatedDonorPartsDto,
): PaginatedResponse<DonorPart> {
  return {
    items: dto.data.map(mapDonorPartDto),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
    },
  };
}

export function mapWarehouseSearchResultDto(
  dto: WarehouseSearchResultDto,
): WarehouseSearchResult {
  return {
    source: dto.source,
    id: dto.id,
    name: dto.name,
    category: mapWarehouseCategoryDto(dto.category),
    price: dto.price,
    purchasePrice: dto.purchase_price,
    quantity: dto.quantity,
    storagePlace: dto.storage_place
      ? mapStoragePlaceDto(dto.storage_place)
      : null,
    location: dto.location ? mapLocationDtoToLocation(dto.location) : null,
  };
}

// ── to dto ──────────────────────────────────────────────────────────────────

/** `*_id` wins on the backend; send the typed name only when nothing was picked. */
function getNewRefName(ref: DictionaryRef): string | null {
  const name = ref.name.trim();
  return ref.id === null && name ? name : null;
}

export function mapNewWarehouseItemToDto(item: NewWarehouseItem) {
  return {
    kind: item.kind,
    category_id: item.category.id,
    category_name: getNewRefName(item.category),
    name: item.name,
    price: item.price || null,
    purchase_price: item.purchasePrice || null,
    supplier_name: item.supplierName || null,
    order_url: item.orderUrl || null,
    unit: item.unit,
  };
}

export function mapNewStockMovementToDto(movement: NewStockMovement) {
  return {
    location_id: movement.locationId,
    quantity: movement.quantity,
    reason: movement.reason,
    note: movement.note || null,
  };
}

export function mapNewDonorToDto(donor: NewDonor) {
  return {
    manufacturer: donor.manufacturer || null,
    device_type: donor.deviceType || null,
    device_model: donor.deviceModel || null,
    origin: donor.origin || null,
    supplier_id: donor.supplierId,
    acquisition_cost: donor.acquisitionCost || null,
    storage_place_id: donor.storagePlace.id,
    storage_place_name: getNewRefName(donor.storagePlace),
    location_id: donor.locationId,
    note: donor.note || null,
  };
}

export function mapNewDonorPartToDto(part: NewDonorPart) {
  return {
    category_id: part.category.id,
    category_name: getNewRefName(part.category),
    name: part.name || null,
    storage_place_id: part.storagePlace.id,
    storage_place_name: getNewRefName(part.storagePlace),
    location_id: part.locationId,
    note: part.note || null,
  };
}

export function mapDonorHandOverToDto(handOver: DonorHandOver) {
  return {
    order_id: handOver.orderId,
    price: handOver.price,
    storage_place_id: handOver.storagePlaceId,
    manager_id: handOver.managerId,
  };
}
