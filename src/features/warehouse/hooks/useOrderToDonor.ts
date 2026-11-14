import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { warehouseApi } from "@/features/warehouse/api";
import {
  type ToDonorFormValues,
  type ToDonorSchema,
  toDonorSchema,
} from "@/features/warehouse/lib/orderActions.schema.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

const FIELD_MAP = { storage_place_id: "storagePlace" } as const;

type UseOrderToDonorParams = {
  orderId: number;
  locationId: number | null;
  onSuccess: () => void;
};

type UseOrderToDonorReturn = {
  methods: UseFormReturn<ToDonorFormValues, unknown, ToDonorSchema>;
  onSubmit: (values: ToDonorSchema) => void;
  isPending: boolean;
};

/** The customer's device is taken apart: a parts-less donor is made from the order. */
export const useOrderToDonor = ({
  orderId,
  locationId,
  onSuccess,
}: UseOrderToDonorParams): UseOrderToDonorReturn => {
  const queryClient = useQueryClient();

  const methods = useForm<ToDonorFormValues, unknown, ToDonorSchema>({
    resolver: zodResolver(toDonorSchema()),
    defaultValues: { storagePlace: { id: null, name: "" } },
  });

  const mutation = useMutation({
    mutationFn: async (values: ToDonorSchema) => {
      const storagePlaceId = await warehouseApi.resolveStoragePlaceId(
        values.storagePlace,
        locationId,
      );
      return warehouseApi.orderToDonor(orderId, storagePlaceId);
    },
    onSuccess: () => {
      toast.success(i18next.t("warehouse.orderActions.toDonorSuccess"));
      void queryClient.invalidateQueries({ queryKey: queryKeys.warehouse.all });
      onSuccess();
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
