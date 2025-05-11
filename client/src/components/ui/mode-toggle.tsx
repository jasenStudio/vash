import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/vash/providers/theme-provider";

interface Props {
  buttonVariant?: "outline" | "sidebar" | "ghost";
  buttonSideBar?: boolean;
  buttonClassName?: string;
  alignMenu?: "end" | "center" | "start";
}

export function ModeToggle({
  buttonVariant = "outline",
  buttonSideBar = false,
  alignMenu = "end",
  buttonClassName,
}: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={buttonVariant} className={buttonClassName}>
          <Sun
            className="h-[2rem] w-[2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            style={{
              height: `${buttonSideBar ? "1.8rem" : "1.4rem"}`,
              width: `${buttonSideBar ? "1.8rem" : "1.4rem"}`,
            }}
          />
          <Moon
            className="absolute h-[2rem] w-[2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            style={{
              height: `${buttonSideBar ? "1.8rem" : "1.4rem"}`,
              width: `${buttonSideBar ? "1.8rem" : "1.4rem"}`,
            }}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={alignMenu}>
        {theme === "dark" ? (
          <DropdownMenuItem
            onClick={() => {
              setTheme("light");
            }}
          >
            Claro
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Oscuro
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
