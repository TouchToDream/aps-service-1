import { describe, expect, it } from "vitest";

import { mapNewProductToDto } from "@/features/orders/lib/adapters.ts";
import {
  mapNewDonorPartToDto,
  mapNewWarehouseItemToDto,
} from "@/features/warehouse/lib/adapters.ts";

describe("mapNewWarehouseItemToDto", () => {
  const base = {
    kind: "showcase" as const,
    name: "Павербанк Baseus 20000",
    price: "1450",
    purchasePrice: "",
    supplierName: "",
    orderUrl: "",
    unit: "piece" as const,
  };

  it("sends the id of a picked category and no name", () => {
    const dto = mapNewWarehouseItemToDto({
      ...base,
      category: { id: 7, name: "Павербанк" },
    });
    expect(dto.category_id).toBe(7);
    expect(dto.category_name).toBeNull();
    expect(dto.purchase_price).toBeNull();
  });

  it("sends a typed category name to be created on the fly", () => {
    const dto = mapNewWarehouseItemToDto({
      ...base,
      category: { id: null, name: "  Павербанк " },
    });
    expect(dto.category_id).toBeNull();
    expect(dto.category_name).toBe("Павербанк");
  });

  it("no longer sends storage place or minimum quantity", () => {
    const dto = mapNewWarehouseItemToDto({
      ...base,
      category: { id: 7, name: "Павербанк" },
    });
    expect(dto).not.toHaveProperty("storage_place_id");
    expect(dto).not.toHaveProperty("min_quantity");
  });
});

describe("mapNewProductToDto (order line)", () => {
  const line = {
    name: "Павербанк Baseus 20000",
    price: "1300",
    purchasePrice: "980",
    supplierName: "Rozetka",
    quantity: 1,
    managerId: 12,
  };

  it("does not send name / purchase price for a warehouse line", () => {
    expect(
      mapNewProductToDto({ ...line, warehouseItemId: 41, donorPartId: null }),
    ).toEqual({
      warehouse_item_id: 41,
      price: "1300",
      quantity: 1,
      manager_id: 12,
    });
    expect(
      mapNewProductToDto({ ...line, warehouseItemId: null, donorPartId: 77 }),
    ).toEqual({
      donor_part_id: 77,
      price: "1300",
      quantity: 1,
      manager_id: 12,
    });
  });

  it("keeps the manual line as it was", () => {
    expect(
      mapNewProductToDto({ ...line, warehouseItemId: null, donorPartId: null }),
    ).toEqual({
      name: "Павербанк Baseus 20000",
      price: "1300",
      purchase_price: "980",
      quantity: 1,
      supplier_name: "Rozetka",
      manager_id: 12,
    });
  });
});

describe("mapNewDonorPartToDto", () => {
  it("never sends donor_id — the endpoint decides the donor", () => {
    const dto = mapNewDonorPartToDto({
      category: { id: 11, name: "Матриця" },
      name: "",
      storagePlace: { id: null, name: "Коробка 3" },
      locationId: 1,
      note: "",
    });
    expect(dto).not.toHaveProperty("donor_id");
    expect(dto.storage_place_name).toBe("Коробка 3");
  });
});
