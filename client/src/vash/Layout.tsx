import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui-custom/app-sidebar";
import { Eye } from "lucide-react";
interface Props extends PropsWithChildren {}
const CustomSidebarTrigger = () => {
  const { toggleSidebar, open } = useSidebar();

  return (
    <button onClick={toggleSidebar} className="custom-trigger-styles">
      {/* Puedes agregar iconos, texto u otros elementos */}
      Toggle Menu
    </button>
  );
};
export const LayoutRoot = ({ children }: Props) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/sign-in", "/sign-up"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      <SidebarProvider>
        {" "}
        {showNavbar && (
          <>
            <AppSidebar />
            <Eye color="green" size={"40px"} />

            <CustomSidebarTrigger />
          </>
        )}
        {children}
      </SidebarProvider>
    </>
  );
};
