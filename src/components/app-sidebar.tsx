import * as React from "react";

import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  items: [
    {
      title: "Flags",
      url: "/flags",
    },
    {
      title: "Environments",
      url: "/environments",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex">
          <Image
            alt="green dolphin"
            src="/logo.png"
            width={100}
            height={60}
          ></Image>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>{item.title}</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
