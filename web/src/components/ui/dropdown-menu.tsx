import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenuContext = React.createContext<{ close: () => void } | null>(null);

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function DropdownMenu({ children, trigger, align = "right", className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={() => setOpen(!open)}>
        {trigger}
      </div>
      {open && (
        <DropdownMenuContext.Provider value={{ close: closeMenu }}>
          <div
            className={cn(
              "absolute z-50 mt-2 min-w-[160px] rounded-md border bg-white shadow-lg py-1",
              "md:min-w-[180px]",
              "xl:min-w-[200px]",
              align === "right" ? "right-0" : "left-0",
              className
            )}
          >
            {children}
          </div>
        </DropdownMenuContext.Provider>
      )}
    </div>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive";
}

export function DropdownMenuItem({ 
  children, 
  onClick, 
  className,
  variant = "default"
}: DropdownMenuItemProps) {
  const context = React.useContext(DropdownMenuContext);

  const handleClick = () => {
    onClick?.();
    context?.close();
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "px-3 py-2 text-sm cursor-pointer transition-colors",
        "md:px-4 md:py-2.5 md:text-base",
        "xl:px-5 xl:py-3",
        variant === "destructive"
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100",
        className
      )}
    >
      {children}
    </div>
  );
}

