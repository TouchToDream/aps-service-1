import { useMutation, useQueryClient } from "@tanstack/react-query";
import imageCompression from "browser-image-compression";
import i18next from "i18next";
import { toast } from "sonner";

import {
  WAREHOUSE_PHOTO_COMPRESSION,
  WAREHOUSE_PHOTO_MAX_BYTES,
} from "@/features/warehouse/lib/constants.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UsePhotoUploadReturn = {
  upload: (file: File) => void;
  isPending: boolean;
};

async function fitPhoto(file: File): Promise<File> {
  if (file.size <= WAREHOUSE_PHOTO_MAX_BYTES) return file;
  const blob = await imageCompression(file, WAREHOUSE_PHOTO_COMPRESSION);
  return new File([blob], file.name, { type: blob.type });
}

/**
 * One photo per card: a new upload replaces the old one. Oversized images are
 * compressed below the backend limit before sending.
 */
export const usePhotoUpload = (
  uploadFn: (file: File) => Promise<unknown>,
): UsePhotoUploadReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (file: File) => uploadFn(await fitPhoto(file)),
    onSuccess: () => {
      toast.success(i18next.t("warehouse.photo.success"));
      return queryClient.invalidateQueries({
        queryKey: queryKeys.warehouse.all,
      });
    },
  });

  return { upload: mutation.mutate, isPending: mutation.isPending };
};
