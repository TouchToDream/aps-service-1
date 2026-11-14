import { ImageOff } from "lucide-react";

import { cn } from "@/shared/lib/utils.ts";

interface PhotoThumbProps {
  url: string | null;
  alt: string;
  className?: string;
}

export const PhotoThumb = ({ url, alt, className }: PhotoThumbProps) => (
  <div
    className={cn(
      "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted",
      className,
    )}
  >
    {url ? (
      <img src={url} alt={alt} className="h-full w-full object-cover" />
    ) : (
      <ImageOff className="h-4 w-4 text-muted-foreground" />
    )}
  </div>
);
