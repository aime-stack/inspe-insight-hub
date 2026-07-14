import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  School,
  Users,
  CalendarCheck,
  ClipboardList,
  AlertTriangle,
  Sparkles,
  FolderOpen,
  BarChart3,
  Handshake,
  FileText,
  Settings,
  Search,
  Bell,
  LogOut,
  GraduationCap,
} from "lucide-react";
import type { ReactNode } from "react";
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
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navMain = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Schools", url: "/schools", icon: School },
  { title: "Contacts", url: "/contacts", icon: Users },
  { title: "Visits", url: "/visits", icon: CalendarCheck },
  { title: "Research", url: "/research", icon: ClipboardList },
];

const navIntel = [
  { title: "Problems", url: "/problems", icon: AlertTriangle },
  { title: "Feature Requests", url: "/features", icon: Sparkles },
  { title: "Evidence", url: "/evidence", icon: FolderOpen },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const navCrm = [
  { title: "Follow-ups", url: "/follow-ups", icon: Handshake },
  { title: "Reports", url: "/reports", icon: FileText },
];

const navFooter = [{ title: "Settings", url: "/settings", icon: Settings }];

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 px-2 py-1">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--sidebar-primary)] text-[color:var(--sidebar-primary-foreground)] shadow-sm">
        <GraduationCap className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-[color:var(--sidebar-foreground)]">
          Inspe Research
        </div>
        <div className="truncate text-[11px] text-[color:var(--sidebar-foreground)]/70">
          Spellabs Solutions
        </div>
      </div>
    </div>
  );
}

function NavSection({
  label,
  items,
}: {
  label: string;
  items: { title: string; url: string; icon: React.ElementType }[];
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[color:var(--sidebar-foreground)]/60">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active =
              item.url === "/"
                ? pathname === "/"
                : pathname === item.url || pathname.startsWith(item.url + "/");
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                  <Link to={item.url} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <BrandMark />
        </SidebarHeader>
        <SidebarContent>
          <NavSection label="Research" items={navMain} />
          <NavSection label="Intelligence" items={navIntel} />
          <NavSection label="Sales CRM" items={navCrm} />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {navFooter.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link to={item.url} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <div className="mt-2 flex items-center gap-2 rounded-md bg-[color:var(--sidebar-accent)] px-2 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">
                    JM
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <div className="truncate text-xs font-medium text-[color:var(--sidebar-foreground)]">
                    Jean Mukiza
                  </div>
                  <div className="truncate text-[10px] text-[color:var(--sidebar-foreground)]/70">
                    Research Manager
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-[color:var(--sidebar-foreground)]/70 hover:text-[color:var(--sidebar-foreground)] group-data-[collapsible=icon]:hidden"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
          <div className="relative hidden flex-1 max-w-md md:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search schools, contacts, visits…"
              className="h-9 pl-8 bg-muted/50 border-transparent focus-visible:bg-background"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-flex">
              ⌘K
            </kbd>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge className="hidden sm:inline-flex bg-cream text-cream-foreground hover:bg-cream border-transparent">
              Beta
            </Badge>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
            </Button>
          </div>
        </header>
        <main className="min-h-[calc(100svh-3.5rem)] bg-muted/30">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
