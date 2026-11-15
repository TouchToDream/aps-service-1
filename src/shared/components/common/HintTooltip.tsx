import type { ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip.tsx";

interface HintTooltipProps {
  hint: string;
  children: ReactNode;
}

/**
 * Explains what an icon button does. The trigger is a wrapping span, so the
 * hint also shows on a disabled button (which gets no pointer events itself).
 */
export const HintTooltip = ({ hint, children }: HintTooltipProps) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">{children}</span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">{hint}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
