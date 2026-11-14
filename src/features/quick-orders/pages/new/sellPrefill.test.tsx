import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  NewQuickOrderSchema,
  QuickOrderPrefillState,
} from "@/features/quick-orders/lib/schema.ts";

// jsdom gaps: Radix needs ResizeObserver, useIsMobile needs matchMedia,
// the spinner library doesn't load.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) satisfies MediaQueryList;
vi.mock("react-loader-spinner", () => ({ MutatingDots: () => null }));

const onSubmit = vi.fn<(values: NewQuickOrderSchema) => void>();

vi.mock("@/features/auth/hooks/useAuth.ts", () => ({
  useAuth: () => ({ user: { id: 1, location: null }, can: () => true }),
}));
vi.mock("@/features/quick-orders/hooks/useAddQuickOrder.ts", () => ({
  useAddQuickOrder: () => ({ onSubmit, isPending: false }),
}));
vi.mock("@/features/quick-orders/hooks/useQuickOrderFormDefaults.ts", () => ({
  useQuickOrderFormDefaults: () => ({
    users: [],
    isLoadingUsers: false,
    locations: [{ id: 2, name: "Центр" }],
    isLoadingLocations: false,
  }),
}));

const { default: CreateQuickOrderPage } =
  await import("@/features/quick-orders/pages/new/index.tsx");

const renderWithSellState = (state: QuickOrderPrefillState) => {
  const router = createMemoryRouter(
    [{ path: "/quick-orders/new", element: <CreateQuickOrderPage /> }],
    { initialEntries: [{ pathname: "/quick-orders/new", state }] },
  );
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, enabled: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
};

describe("Showcase 'Sell' → new quick sale", () => {
  beforeEach(() => onSubmit.mockClear());

  it("submits the line linked to the warehouse item, not as free text", async () => {
    renderWithSellState({
      locationId: 2,
      product: {
        warehouseItemId: 41,
        name: "Павербанк Baseus",
        price: "1450",
        purchasePrice: "140",
      },
    });

    // The draft row shows the card's purchase price before saving.
    expect(screen.getByText("140")).toBeInTheDocument();

    // Payment method is the only thing the user has to pick.
    fireEvent.click(screen.getByLabelText("orders.paymentMethods.cash"));
    fireEvent.click(
      screen.getByRole("button", { name: "quickOrders.actions.create" }),
    );

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const values = onSubmit.mock.calls[0][0];
    expect(values.locationId).toBe(2);
    expect(values.products).toEqual([
      expect.objectContaining({
        warehouseItemId: 41,
        donorPartId: null,
        price: "1450",
        quantity: 1,
      }),
    ]);
  });

  it("keeps the link after the line is opened and re-saved (e.g. a discount)", async () => {
    renderWithSellState({
      locationId: 2,
      product: {
        warehouseItemId: 41,
        name: "Павербанк Baseus",
        price: "1450",
        purchasePrice: "140",
      },
    });

    fireEvent.click(screen.getByText("Павербанк Baseus"));
    const priceInput = await screen.findByDisplayValue("1450");
    fireEvent.change(priceInput, { target: { value: "1300" } });
    fireEvent.click(screen.getByRole("button", { name: "common.save" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    fireEvent.click(screen.getByLabelText("orders.paymentMethods.cash"));
    fireEvent.click(
      screen.getByRole("button", { name: "quickOrders.actions.create" }),
    );

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0].products).toEqual([
      expect.objectContaining({
        warehouseItemId: 41,
        price: "1300",
        purchasePrice: "140",
      }),
    ]);
  });
});
