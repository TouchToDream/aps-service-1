import { warehouseApi } from "@/features/warehouse/api";
import { PhotoThumb } from "@/features/warehouse/components/PhotoThumb.tsx";
import { PhotoUploadButton } from "@/features/warehouse/components/PhotoUploadButton.tsx";
import { usePhotoUpload } from "@/features/warehouse/hooks/usePhotoUpload.ts";
import { getPartDisplayName } from "@/features/warehouse/lib/service.ts";
import type { DonorPart } from "@/features/warehouse/types.ts";

interface PartPhotoSectionProps {
  part: DonorPart;
}

export const PartPhotoSection = ({ part }: PartPhotoSectionProps) => {
  const { upload, isPending } = usePhotoUpload((file) =>
    warehouseApi.uploadPartPhoto(part.id, file),
  );

  return (
    <div className="flex items-center gap-3">
      <PhotoThumb
        url={part.photoUrl}
        alt={getPartDisplayName(part)}
        className="h-20 w-20"
      />
      <PhotoUploadButton
        hasPhoto={part.photoUrl !== null}
        isPending={isPending}
        onSelect={upload}
      />
    </div>
  );
};
