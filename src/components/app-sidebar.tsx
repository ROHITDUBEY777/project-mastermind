import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Workflow,
  Activity,
  FolderKanban,
  LineChart,
  ListChecks,
  Package,
  CalendarRange,
  Library,
  TrendingUp,
} from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";

const overview = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "About", url: "/about", icon: BookOpen },
  { title: "Methodology", url: "/methodology", icon: Workflow },
];

const platform = [
  { title: "Simulator", url: "/simulator", icon: Activity },
  { title: "Scenarios", url: "/scenarios", icon: FolderKanban },
  { title: "ML Forecast", url: "/forecast", icon: LineChart },
];

const docs = [
  { title: "Requirements", url: "/requirements", icon: ListChecks },
  { title: "Deliverables", url: "/deliverables", icon: Package },
  { title: "Timeline", url: "/timeline", icon: CalendarRange },
  { title: "References", url: "/references", icon: Library },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const renderGroup = (label: string, items: typeof overview) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = pathname === item.url;
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={active}>
                  <Link to={item.url} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <TrendingUp className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold font-display">MarketSim</div>
              <div className="text-[10px] text-muted-foreground">AIT · Group 19</div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Project", overview)}
        {renderGroup("Platform", platform)}
        {renderGroup("Documentation", docs)}
      </SidebarContent>
    </Sidebar>
  );
}
