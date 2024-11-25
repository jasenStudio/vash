import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";

//* Hooks and Store
import { useIsMobile } from "@/hooks/use-mobile";
import { useUiTitleStore } from "./store/ui/useUititleStore";
import { useAuthStore } from "./store/auth/useAuthStore";

//* Components & Custom Components
import {
  SidebarTriggerCustom,
  ToggleModeCustom,
  BreadcrumbsCustom,
  AppSidebar,
} from "@/components/ui-custom";
import { SidebarProvider } from "@/components/ui/sidebar";

//*Styles
import "@/vash/styles/App.css";

export const LayoutRoot = () => {
  const isMobile = useIsMobile();
  const title = useUiTitleStore((state) => state.title);
  const logout = useAuthStore((state) => state.logout);

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full p-6 sm:px-4 sm:py-4">
          <div className="flex justify-between border rounded-md">
            <div className="flex justify-center items-center p-1 sm:p-4">
              <SidebarTriggerCustom />

              {/* title only for mobile */}
              {isMobile && (
                <span className="text-[18px] font-semibold capitalize">
                  {title}
                </span>
              )}

              {/* breadcumbs and title only for desktop and tablet or landscape */}
              {!isMobile && (
                <div>
                  <BreadcrumbsCustom />
                  <span className="text-[18px] font-semibold capitalize">
                    {title}
                  </span>
                </div>
              )}
            </div>
            {/* Toggle and button Logout only for desktop and tablet or landscape */}
            {!isMobile && (
              <div className="flex justify-center items-center mr-2">
                <ToggleModeCustom />
                <button
                  className="font-semibold rounded-[5px] mx-5"
                  onClick={logout}
                >
                  <LogOut className="inline-block mr-1" size={35} />
                </button>
              </div>
            )}
          </div>
          <div className="w-full py-8 px-4">
            <Outlet />
          </div>
          <div className="absolute bottom-0">footer</div>
        </div>
      </SidebarProvider>
    </>
  );
};
