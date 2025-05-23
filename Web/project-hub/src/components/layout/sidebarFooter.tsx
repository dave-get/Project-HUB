import React from "react";
import { Settings, LogOut } from "lucide-react";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/features/auth/authApi";
import Cookies from "js-cookie";

const SidebarSetting = () => {
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      Cookies.remove("access_token");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
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
        <button onClick={handleLogout}>
          <SidebarMenuButton tooltip="Logout" className="text-foreground">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </SidebarMenuButton>
        </button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarSetting;
