import { describe, expect, it } from "vitest";

import {
  getDonorTitle,
  getSelectableDonorStatuses,
  getSignedStockQuantity,
  getWarehouseLineSource,
  getWarehouseSourceErrorMessage,
  mapDonorFormToNewDonor,
} from "@/features/warehouse/lib/service.ts";
import type { Donor } from "@/features/warehouse/types.ts";

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

describe("getSelectableDonorStatuses", () => {
  it("never offers 'given to customer' — that is reachable only via swap", () => {
    expect(getSelectableDonorStatuses(null)).toEqual([
      "available",
      "disassembling",
      "disposed",
    ]);
    expect(getSelectableDonorStatuses("available")).not.toContain(
      "given_to_customer",
    );
  });

  it("locks a donor that was already given to the customer", () => {
    expect(getSelectableDonorStatuses("given_to_customer")).toEqual([
      "given_to_customer",
    ]);
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
  const values = {
    manufacturer: "Lenovo",
    deviceType: "",
    deviceModel: "IdeaPad 3",
    sourceOrderId: "1234",
    acquisitionCost: "",
    status: "available" as const,
    storagePlace: { id: 2, name: "Полиця А1" },
    locationId: 1,
    note: "",
  };

  it("sends the status for a new donor", () => {
    expect(mapDonorFormToNewDonor(values).status).toBe("available");
    expect(mapDonorFormToNewDonor(values).sourceOrderId).toBe(1234);
  });

  it("omits an unchanged status on update so the backend keeps it", () => {
    const donor = { status: "available", supplier: null } as Pick<
      Donor,
      "status" | "supplier"
    > as Donor;
    expect(mapDonorFormToNewDonor(values, donor).status).toBeUndefined();
    expect(
      mapDonorFormToNewDonor({ ...values, status: "disposed" }, donor).status,
    ).toBe("disposed");
  });
});
