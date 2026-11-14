import { describe, expect, it } from "vitest";

import {
  getDonorTitle,
  getSignedStockQuantity,
  getWarehouseLineSource,
  getWarehouseSourceErrorMessage,
  mapDonorFormToNewDonor,
} from "@/features/warehouse/lib/service.ts";

describe("getSignedStockQuantity", () => {
  it("makes a purchase positive and a write-off negative", () => {
    expect(getSignedStockQuantity("purchase", 5)).toBe(5);
    expect(getSignedStockQuantity("purchase", -5)).toBe(5);
    expect(getSignedStockQuantity("writeoff", 2)).toBe(-2);
    expect(getSignedStockQuantity("writeoff", -2)).toBe(-2);
  });

  it("keeps the sign of a correction as typed", () => {
    expect(getSignedStockQuantity("correction", 3)).toBe(3);
    expect(getSignedStockQuantity("correction", -3)).toBe(-3);
  });
});

describe("getWarehouseLineSource", () => {
  it("maps showcase/supply rows to warehouse_item_id and parts to donor_part_id", () => {
    expect(getWarehouseLineSource({ source: "showcase", id: 41 })).toEqual({
      warehouseItemId: 41,
      donorPartId: null,
    });
    expect(getWarehouseLineSource({ source: "supply", id: 7 })).toEqual({
      warehouseItemId: 7,
      donorPartId: null,
    });
    expect(getWarehouseLineSource({ source: "donor_part", id: 77 })).toEqual({
      warehouseItemId: null,
      donorPartId: 77,
    });
  });
});

describe("getWarehouseSourceErrorMessage", () => {
  it("picks source errors, plain and nested", () => {
    expect(
      getWarehouseSourceErrorMessage({
        donor_part_id: ["Part already used."],
        price: ["Required."],
      }),
    ).toBe("Part already used.");
    expect(
      getWarehouseSourceErrorMessage({
        "products.1.warehouse_item_id": ["Only one source."],
      }),
    ).toBe("Only one source.");
  });

  it("returns null when there are no source errors", () => {
    expect(getWarehouseSourceErrorMessage(undefined)).toBeNull();
    expect(getWarehouseSourceErrorMessage({ price: ["Required."] })).toBeNull();
  });
});

describe("getDonorTitle", () => {
  it("joins the device data and returns null when there is none", () => {
    expect(
      getDonorTitle({
        id: 8,
        manufacturer: "Lenovo",
        deviceType: "Ноутбук",
        deviceModel: "IdeaPad 3",
      }),
    ).toBe("Lenovo Ноутбук IdeaPad 3");
    expect(
      getDonorTitle({
        id: 8,
        manufacturer: null,
        deviceType: " ",
        deviceModel: null,
      }),
    ).toBeNull();
  });
});

describe("mapDonorFormToNewDonor", () => {
  it("never sends a status — it changes only through swap / delete", () => {
    const dto = mapDonorFormToNewDonor({
      manufacturer: "Lenovo",
      deviceType: "",
      deviceModel: "IdeaPad 3",
      origin: "Купили мертвяка на OLX",
      acquisitionCost: "",
      storagePlace: { id: 2, name: "Полиця А1" },
      locationId: 1,
      note: "",
    });
    expect(dto).not.toHaveProperty("status");
    expect(dto.origin).toBe("Купили мертвяка на OLX");
    expect(dto).not.toHaveProperty("sourceOrderId");
  });
});
