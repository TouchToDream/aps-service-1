import { cn } from "@/shared/lib/utils.ts";

interface StockQuantityProps {
  quantity: number | null;
  className?: string;
}

/**
 * Zero and negative stock is shown on purpose (accounting may lag behind the
 * shelf) — highlighted, never hidden.
 */
export const StockQuantity = ({ quantity, className }: StockQuantityProps) => {
  if (quantity === null) {
    return <span className={cn("text-muted-foreground", className)}>—</span>;
  }
  return (
    <span
      className={cn(
        "tabular-nums",
        quantity <= 0 && "font-semibold text-destructive",
        className,
      )}
    >
      {quantity}
    </span>
  );
};
