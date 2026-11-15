import { describe, expect, it } from "vitest";

import {
  getDonorTitle,
  getSignedStockQuantity,
  getWarehouseLineSource,
  getWarehouseSourceErrorMessage,
  mapDonorFormToNewDonor,
  mapStoragePlaceFormValues,
  prepareStoragePlaceList,
  toggleSource,
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

describe("toggleSource", () => {
  it("adds and removes a source, keeping the canonical order", () => {
    expect(toggleSource([], "donor_part")).toEqual(["donor_part"]);
    expect(toggleSource(["donor_part"], "showcase")).toEqual([
      "showcase",
      "donor_part",
    ]);
    expect(toggleSource(["showcase", "supply"], "showcase")).toEqual([
      "supply",
    ]);
  });
});

describe("prepareStoragePlaceList", () => {
  const places = [
    { id: 1, name: "Коробка 3", locationId: 2 },
    { id: 2, name: "Стол", locationId: null },
    { id: 3, name: "Коробка 1", locationId: 1 },
    { id: 4, name: "Ящик", locationId: 1 },
  ];

  it("groups by office (no office last), then by name", () => {
    expect(
      prepareStoragePlaceList(places, undefined, "").map((p) => p.id),
    ).toEqual([3, 4, 1, 2]);
  });

  it("filters by office and name", () => {
    expect(prepareStoragePlaceList(places, "1", "").map((p) => p.id)).toEqual([
      3, 4,
    ]);
    expect(
      prepareStoragePlaceList(places, undefined, "короб").map((p) => p.id),
    ).toEqual([3, 1]);
  });
});

describe("mapStoragePlaceFormValues", () => {
  it("turns the form's strings into a place, 'none' meaning no office", () => {
    expect(
      mapStoragePlaceFormValues({ name: " Стелаж А-1 ", location_id: "1" }),
    ).toEqual({
      name: "Стелаж А-1",
      locationId: 1,
    });
    expect(
      mapStoragePlaceFormValues({ name: "Стол", location_id: "none" }),
    ).toEqual({
      name: "Стол",
      locationId: null,
    });
  });
});
