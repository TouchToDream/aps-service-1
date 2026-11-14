import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { warehouseApi } from "@/features/warehouse/api";
import {
  type DonorSwapFormValues,
  type DonorSwapSchema,
  donorSwapSchema,
} from "@/features/warehouse/lib/orderActions.schema.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

const FIELD_MAP = {
  storage_place_id: "storagePlace",
  manager_id: "managerId",
} as const;

type UseDonorSwapParams = {
  orderId: number;
  locationId: number | null;
  onSuccess: () => void;
};

type UseDonorSwapReturn = {
  methods: UseFormReturn<DonorSwapFormValues, unknown, DonorSwapSchema>;
  onSubmit: (values: DonorSwapSchema) => void;
  isPending: boolean;
};

/**
 * One atomic action on the backend: the old donor goes to the customer (its
 * parts become sold), a line is added to the order, and a new empty donor is
 * born from the customer's device.
 */
export const useDonorSwap = ({
  orderId,
  locationId,
  onSuccess,
}: UseDonorSwapParams): UseDonorSwapReturn => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const methods = useForm<DonorSwapFormValues, unknown, DonorSwapSchema>({
    resolver: zodResolver(donorSwapSchema()),
    defaultValues: {
      donorId: null,
      donorLabel: "",
      price: "",
      storagePlace: { id: null, name: "" },
      managerId: user?.id,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: DonorSwapSchema) => {
      const storagePlaceId = await warehouseApi.resolveStoragePlaceId(
        values.storagePlace,
        locationId,
      );
      return warehouseApi.handOverDonor({
        donorId: values.donorId,
        orderId,
        price: values.price,
        storagePlaceId,
        managerId: values.managerId,
      });
    },
    onSuccess: () => {
      toast.success(i18next.t("warehouse.orderActions.swapSuccess"));
      void queryClient.invalidateQueries({ queryKey: queryKeys.warehouse.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.referrals.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
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
