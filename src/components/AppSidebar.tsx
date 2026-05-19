import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  Home, 
  Server, 
  Users, 
  Settings, 
  Terminal, 
  Database,
  FileCode,
  Shield,
  Globe,
  Boxes,
  Lock,
  LogOut
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Admin", icon: Lock, url: "/admin" },
  { title: "Servers", icon: Server, url: "/servers" },
  { title: "Players", icon: Users, url: "/players" },
  { title: "Console", icon: Terminal, url: "/console" },
  { title: "Backups", icon: Database, url: "/backups" },
  { title: "Files", icon: FileCode, url: "/files" },
  { title: "Security", icon: Shield, url: "/security" },
  { title: "Network", icon: Globe, url: "/network" },
  { title: "Plugins", icon: Boxes, url: "/plugins" },
  { title: "Settings", icon: Settings, url: "/settings" },
]

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Server className="w-5 h-5" />
          MC Manager
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                  <div className="flex items-center gap-2 text-destructive">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
