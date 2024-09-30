import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger className="w-full">
          <div className="flex w-full items-center justify-center">
            <div className="invisible absolute -right-[16px] top-[12px] z-20 lg:visible">
              <Button
                onClick={() => setIsOpen?.()}
                className="h-8 w-8 rounded-md bg-secondary dark:bg-zinc-900"
                variant="outline"
                size="icon"
              >
                <ChevronLeft
                  className={cn(
                    "h-4 w-4 transition-transform duration-700 ease-in-out",
                    isOpen === false ? "rotate-180" : "rotate-0"
                  )}
                />
              </Button>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{isOpen ? "Hide" : "Show"} the sidebar</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
