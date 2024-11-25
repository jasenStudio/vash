import { useSidebar } from "@/components/ui/sidebar";
import { Menu, PanelsTopLeft } from "lucide-react";

export const SidebarTriggerCustom = () => {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <button onClick={toggleSidebar} className="mx-2 mr-4" aria-label="menu">
      {isMobile ? <Menu size={25} /> : <PanelsTopLeft size={30} />}
    </button>
  );
};
