import { useSidebar } from "@/components/ui/sidebar";
import { Menu, PanelsTopLeft } from "lucide-react";

export const SidebarTriggerCustom = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <button onClick={toggleSidebar} className="mx-2 mr-4" aria-label="menu">
      <Menu size={25} className="block sm:hidden" />
      <PanelsTopLeft size={30} className="hidden sm:block" />
    </button>
  );
};
