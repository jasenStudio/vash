import { Outlet } from "react-router-dom";
import { Globe } from "lucide-react";

//* Hooks & Store
import { useIsMobile } from "@/hooks/use-mobile";
import { useUiTitleStore } from "./store/ui/useUititleStore";

import { useTranslation } from "react-i18next";
import i18next from "i18next";

//* Components & Custom Components
import {
  AppSidebar,
  BreadcrumbsCustom,
  ButtonLogoutCustom,
  FooterCustom,
  FooterCustomMobile,
  SidebarTriggerCustom,
  ToggleModeCustom,
} from "@/components/ui-custom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarProvider } from "@/components/ui/sidebar";

//*Styles
import "@/vash/styles/App.css";

import flagColombia from "@/assets/colombia.svg";
import flagUsa from "@/assets/usa.svg";
import { useCurrentLanguage } from "@/hooks/use-current-language";

export const LayoutRoot = () => {
  const isMobile = useIsMobile();
  const title = useUiTitleStore((state) => state.title);
  const { currentLanguage } = useCurrentLanguage();
  const { t } = useTranslation();

  const footerText = t("configuration.selectLanguage");
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full p-6 sm:px-4 sm:py-4">
          <div className="flex justify-between border rounded-md">
            <div className="flex justify-center items-center p-1 sm:p-4">
              <SidebarTriggerCustom />

              {/* title only for mobile */}
              <span
                className={`text-[18px] font-semibold capitalize block sm:hidden`}
              >
                {title}
              </span>
              {/* breadcumbs and title only for desktop and tablet or landscape */}
              <div className="hidden sm:block">
                <BreadcrumbsCustom />
                <span className="text-[18px] font-semibold capitalize">
                  {title}
                </span>
              </div>
            </div>
            {/* Toggle and button Logout only for desktop and tablet or landscape */}
            <div className="hidden sm:flex">
              <div className="flex justify-center items-center mr-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="uppercase flex flew-row mx-6">
                    <Globe className="mx-2" />
                    {currentLanguage}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => i18next.changeLanguage("es")}
                      className="dark:hover:bg-sky-900"
                    >
                      <img
                        src={flagColombia}
                        alt="bandera de colombia"
                        width={20}
                      />
                      ES
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => i18next.changeLanguage("en")}
                      className="dark:hover:bg-sky-900"
                    >
                      {" "}
                      <img
                        src={flagUsa}
                        alt="bandera de Estados unidos"
                        width={20}
                      />
                      EN
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                  <span className="sr-only">{footerText}</span>
                </DropdownMenu>

                <ToggleModeCustom />
                <ButtonLogoutCustom />
              </div>
            </div>
          </div>
          {/* Contenido principal */}
          <div className="w-full py-8 px-4">
            <Outlet />
          </div>
          <div className="absolute bottom-0 overflow-x-hidden">
            {isMobile ? (
              <FooterCustomMobile className="block sm:hidden" />
            ) : (
              <FooterCustom className="hidden sm:block" />
            )}
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};
