"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import SidebarProfile from "./SidebarProfile";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronRight,
  House,
  PersonStanding,
  Puzzle,
  TrainTrack,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarSetting from "./sidebarFooter";

interface MenuItem {
  title: string;
  url: string;
  items: Array<{ title: string; url: string }>;
  icon: React.ReactNode;
}

// This is sample data.
const menuItems: MenuItem[] = [
  {
    title: "Home",
    url: "/home",
    items: [],
    icon: <House />,
  },
  {
    title: "Proposal",
    url: "/proposal",
    icon: <TrainTrack />,
    items: [
      {
        title: "Approved",
        url: `/proposal/approved`,
      },
      {
        title: "Rejected",
        url: `/proposal/rejected`,
      },
      {
        title: "Feedback",
        url: `/proposal/Feedback`,
      },
    ],
  },
  {
    title: "Project",
    url: "/project",
    items: [
      {
        title: "Submit",
        url: `/project/submit`,
      },
    ],
    icon: <Puzzle />,
  },
  {
    title: "Students",
    url: "/students",
    icon: <PersonStanding />,
    items: [],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  // console.log("pathname", pathname);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-background border-b p-4">
        <SidebarProfile />
      </SidebarHeader>
      <SidebarContent className="bg-background text-foreground px-2 pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Platform</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem
                  className={`hover:bg-muted p-2 rounded-lg ${
                    pathname === item.url
                      ? "bg-primary/30 text-primary font-semibold"
                      : "text-foreground"
                  }`}
                >
                  <Link href={item.url}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon}
                        <span>{item.title}</span>
                        {item.items?.length > 0 && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </Link>
                  {item.items?.length > 0 && (
                    <CollapsibleContent className="p-0">
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className={`p-1 hover:bg-muted rounded w-full ${
                              pathname === subItem.url
                                ? "bg-primary/30 text-primary font-semibold"
                                : "text-foreground font-normal"
                            }`}
                          >
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url} className="block">
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-background border-t p-4">
        <SidebarSetting />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
