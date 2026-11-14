import { Camera } from "lucide-react";
import { type ChangeEvent, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button.tsx";

interface PhotoUploadButtonProps {
  hasPhoto: boolean;
  isPending: boolean;
  onSelect: (file: File) => void;
}

export const PhotoUploadButton = ({
  hasPhoto,
  isPending,
  onSelect,
}: PhotoUploadButtonProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) onSelect(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        <Camera className="h-4 w-4" />
        {t(hasPhoto ? "warehouse.photo.replace" : "warehouse.photo.upload")}
      </Button>
    </>
  );
};
