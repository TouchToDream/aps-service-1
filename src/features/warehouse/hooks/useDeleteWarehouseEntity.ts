import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseDeleteWarehouseEntityReturn = {
  onDelete: (id: number) => void;
  isPending: boolean;
};

/** Soft delete of an item / donor / part — all refresh the whole warehouse cache. */
export const useDeleteWarehouseEntity = (
  deleteFn: (id: number) => Promise<void>,
  onSuccess?: () => void,
): UseDeleteWarehouseEntityReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      toast.success(i18next.t("common.deleteDialog.success"));
      onSuccess?.();
      return queryClient.invalidateQueries({
        queryKey: queryKeys.warehouse.all,
      });
    },
  });

  return { onDelete: mutation.mutate, isPending: mutation.isPending };
};
