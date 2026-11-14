import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { warehouseApi } from "@/features/warehouse/api";
import {
  type WarehouseItemFormValues,
  type WarehouseItemSchema,
  warehouseItemSchema,
} from "@/features/warehouse/lib/item.schema.ts";
import {
  getWarehouseItemFormDefaults,
  mapWarehouseItemFormToNewItem,
} from "@/features/warehouse/lib/service.ts";
import type {
  WarehouseItem,
  WarehouseItemDetail,
  WarehouseItemKind,
} from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

const FIELD_MAP = {
  category_id: "category",
  category_name: "category",
  purchase_price: "purchasePrice",
  supplier_name: "supplierName",
  order_url: "orderUrl",
} as const;

type UseWarehouseItemFormParams = {
  kind: WarehouseItemKind;
  item?: WarehouseItem;
  onSuccess: (item: WarehouseItemDetail) => void;
};

type UseWarehouseItemFormReturn = {
  methods: UseFormReturn<WarehouseItemFormValues, unknown, WarehouseItemSchema>;
  onSubmit: (values: WarehouseItemSchema) => void;
  isPending: boolean;
};

export const useWarehouseItemForm = ({
  kind,
  item,
  onSuccess,
}: UseWarehouseItemFormParams): UseWarehouseItemFormReturn => {
  const queryClient = useQueryClient();

  const methods = useForm<
    WarehouseItemFormValues,
    unknown,
    WarehouseItemSchema
  >({
    resolver: zodResolver(warehouseItemSchema()),
    defaultValues: getWarehouseItemFormDefaults(kind, item),
  });

  const mutation = useMutation({
    mutationFn: (values: WarehouseItemSchema) => {
      const payload = mapWarehouseItemFormToNewItem(values);
      return item
        ? warehouseApi.updateItem(item.id, payload)
        : warehouseApi.createItem(payload);
    },
    onSuccess: (saved) => {
      toast.success(
        i18next.t(
          item
            ? "warehouse.item.successUpdate"
            : "warehouse.item.successCreate",
        ),
      );
      // Categories, storage places and suppliers may have been created on the fly.
      void queryClient.invalidateQueries({ queryKey: queryKeys.warehouse.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dictionaries.suppliers(),
      });
      onSuccess(saved);
    },
    onError: (error) => {
      if (isApiError(error) && error.status === 422) {
        handleFormError(error, methods.setError, { fieldMap: FIELD_MAP });
      } else {
        notifyError(error);
      }
    },
  });

  return {
    methods,
    onSubmit: mutation.mutate,
    isPending: mutation.isPending,
  };
};
