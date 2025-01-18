import * as React from "react";
import { useState } from "react";
import {
  Blocks,
  Calendar,
  ChevronRight,
  Eye,
  MessageCircleQuestion,
  Settings,
  Settings2,
  Trash2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

//* Store & Hook
import { useAuthStore } from "@/vash/store/auth/useAuthStore";
import { useTranslation } from "react-i18next";

import { SettingDialogCustom, NavUser } from "@/components/ui-custom";
import { Link } from "react-router-dom";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Accounts",
      url: "/",
      items: [
        {
          title: "Account List",
          url: "/",
        },
        {
          title: "Show List",
          url: "/accounts/show",
        },
      ],
    },
    {
      title: "Subscriptions",
      url: "/subscriptions/list",
      items: [
        {
          title: "List subscription",
          url: "/subscriptions/list",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
        {
          title: "Caching",
          url: "#",
        },
        {
          title: "Styling",
          url: "#",
        },
        {
          title: "Optimizing",
          url: "#",
        },
        {
          title: "Configuring",
          url: "#",
        },
        {
          title: "Testing",
          url: "#",
        },
        {
          title: "Authentication",
          url: "#",
        },
        {
          title: "Deploying",
          url: "#",
        },
        {
          title: "Upgrading",
          url: "#",
        },
        {
          title: "Examples",
          url: "#",
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
        {
          title: "Functions",
          url: "#",
        },
        {
          title: "next.config.js Options",
          url: "#",
        },
        {
          title: "CLI",
          url: "#",
        },
        {
          title: "Edge Runtime",
          url: "#",
        },
      ],
    },
    {
      title: "Architecture",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
        {
          title: "Next.js Compiler",
          url: "#",
        },
        {
          title: "Supported Browsers",
          url: "#",
        },
        {
          title: "Turbopack",
          url: "#",
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [
        {
          title: "Contribution Guide",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Templates",
      url: "#",
      icon: Blocks,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userStore = useAuthStore((state) => state.user);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const { t } = useTranslation();

  const user = {
    avatar: "",
    name: userStore?.user_name || "johndoe",
    email: userStore?.email || "johndoe@gmail.com",
  };

  const toggleDialogVisibility = () => {
    setIsDialogVisible((prev) => !prev);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent
        className="gap-0"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#5d5d5d #18171b00",
        }}
      >
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger className="my-2 flex justify-center items-center">
                  <Eye className="mr-2" /> {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <Link to={item.url}>{item.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarFooter className="flex flex-row items-center">
        <Button
          onClick={toggleDialogVisibility}
          variant="ghost"
          className="px-2 capitalize w-full hover:bg-sidebar-accent"
        >
          <Settings />
          {t("configuration.title")}
        </Button>
      </SidebarFooter>
      <SidebarRail />

      {isDialogVisible && (
        <SettingDialogCustom
          open={isDialogVisible}
          customTrigger
          onOpenChange={toggleDialogVisibility}
          className="px-2 capitalize w-full hover:bg-sidebar-accent"
          text={t("configuration.title")}
        />
      )}
    </Sidebar>
  );
}
