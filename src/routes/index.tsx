import { createFileRoute } from "@tanstack/react-router";
import {
  School,
  CalendarCheck,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  Plus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader, PageBody } from "@/components/page-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Inspe School Research CRM" },
      {
        name: "description",
        content:
          "Executive overview of research progress, school coverage, discovered problems, and feature demand.",
      },
    ],
  }),
  component: Dashboard,
});

const problemsByCategory = [
  { category: "Attendance", count: 84 },
  { category: "Reporting", count: 71 },
  { category: "Finance", count: 63 },
  { category: "Comms", count: 52 },
  { category: "ICT", count: 44 },
  { category: "Library", count: 28 },
];

const visitsTrend = [
  { month: "Jan", planned: 18, completed: 14 },
  { month: "Feb", planned: 22, completed: 19 },
  { month: "Mar", planned: 28, completed: 24 },
  { month: "Apr", planned: 34, completed: 30 },
  { month: "May", planned: 41, completed: 36 },
  { month: "Jun", planned: 46, completed: 42 },
];

const schoolTypes = [
  { name: "Public", value: 148 },
  { name: "Private", value: 92 },
  { name: "Faith-based", value: 54 },
  { name: "TVET", value: 31 },
];

const pieColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

const provinces = [
  { name: "Kigali", schools: 82, progress: 78 },
  { name: "Eastern", schools: 61, progress: 54 },
  { name: "Southern", schools: 58, progress: 46 },
  { name: "Western", schools: 71, progress: 41 },
  { name: "Northern", schools: 53, progress: 35 },
];

const activity = [
  {
    who: "Aline U.",
    action: "completed visit at",
    target: "GS Kacyiru II",
    time: "12m ago",
    tone: "success" as const,
  },
  {
    who: "Patrick M.",
    action: "logged 3 problems at",
    target: "Lycée de Kigali",
    time: "1h ago",
    tone: "warning" as const,
  },
  {
    who: "Diane K.",
    action: "scheduled a visit to",
    target: "APAPER Nyamirambo",
    time: "3h ago",
    tone: "info" as const,
  },
  {
    who: "Jean M.",
    action: "moved 2 schools to Pilot in",
    target: "Sales pipeline",
    time: "yesterday",
    tone: "info" as const,
  },
];

function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ElementType;
  tone: "primary" | "success" | "warning" | "cream";
}) {
  const bg = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-accent/20 text-accent-foreground",
    cream: "bg-cream text-cream-foreground",
  }[tone];
  return (
    <Card className="shadow-none">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </div>
            {delta && (
              <div className="mt-1 flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3.5 w-3.5" />
                {delta}
              </div>
            )}
          </div>
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${bg}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  return (
    <>
      <PageHeader
        title="Welcome back, Jean"
        description="Here's what's happening across your research operations today."
        actions={
          <>
            <Button variant="outline">
              <CalendarCheck className="mr-2 h-4 w-4" />
              Schedule visit
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add school
            </Button>
          </>
        }
      />
      <PageBody className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Schools" value="325" delta="+12 this month" icon={School} tone="primary" />
          <StatCard label="Schools Visited" value="187" delta="57% coverage" icon={CheckCircle2} tone="success" />
          <StatCard label="Pending Visits" value="46" icon={Clock} tone="warning" />
          <StatCard label="Problems Identified" value="412" delta="+38 this week" icon={AlertTriangle} tone="cream" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Research progress</CardTitle>
                  <CardDescription>Planned vs. completed visits</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-cream text-cream-foreground border-transparent">
                  Last 6 months
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitsTrend} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="planned"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">School types</CardTitle>
              <CardDescription>Distribution across portfolio</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={schoolTypes}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {schoolTypes.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Problems by category</CardTitle>
              <CardDescription>Most frequently reported operational pain points</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={problemsByCategory} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    cursor={{ fill: "var(--color-muted)" }}
                  />
                  <Bar dataKey="count" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Coverage by province</CardTitle>
              </div>
              <CardDescription>Research completion by region</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {provinces.map((p) => (
                <div key={p.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="text-muted-foreground">
                      {p.schools} <span className="text-xs">schools · {p.progress}%</span>
                    </span>
                  </div>
                  <Progress value={p.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent activity</CardTitle>
              <CardDescription>Latest actions from your research team</CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
              {activity.map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {a.who
                        .split(" ")
                        .map((s) => s[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-sm">
                    <span className="font-medium text-foreground">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>{" "}
                    <span className="font-medium text-foreground">{a.target}</span>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-none bg-cream/40 border-cream">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Top feature requests</CardTitle>
              </div>
              <CardDescription>Ranked by demand across schools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Digital attendance", schools: 142 },
                { name: "Automated reports", schools: 118 },
                { name: "Parent SMS portal", schools: 96 },
                { name: "Fee reconciliation", schools: 74 },
              ].map((f, i) => (
                <div key={f.name} className="flex items-center gap-3 rounded-lg bg-background p-3">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{f.name}</div>
                    <div className="text-xs text-muted-foreground">
                      <Users className="mr-1 inline h-3 w-3" />
                      {f.schools} schools requesting
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
