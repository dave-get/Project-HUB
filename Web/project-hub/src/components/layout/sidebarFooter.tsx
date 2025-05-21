import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const SidebarSetting = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="hover:bg-muted p-2 rounded-lg">
        <Link href="/settings">
          <SidebarMenuButton tooltip="Settings" className="text-foreground">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      
      <SidebarMenuItem className="hover:bg-muted p-2 rounded-lg">
        <Link href="/logout">
          <SidebarMenuButton tooltip="Logout" className="text-foreground">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarSetting;