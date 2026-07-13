import { createFileRoute } from "@tanstack/react-router";
import { Filter, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, PageBody } from "@/components/page-header";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics · Inspe Research CRM" },
      { name: "description", content: "Executive analytics on problems, demand, digital maturity, and regional trends." },
    ],
  }),
  component: AnalyticsPage,
});

const problemsByDept = [
  { dept: "Academics", count: 92 },
  { dept: "Reporting", count: 78 },
  { dept: "Finance", count: 71 },
  { dept: "Comms", count: 54 },
  { dept: "ICT", count: 48 },
  { dept: "HR", count: 32 },
  { dept: "Library", count: 21 },
];

const digitalMaturity = [
  { subject: "Attendance", A: 42 },
  { subject: "Reports", A: 28 },
  { subject: "Finance", A: 34 },
  { subject: "Parents", A: 21 },
  { subject: "ICT infra", A: 55 },
  { subject: "Records", A: 38 },
];

const software = [
  { name: "Excel", value: 214 },
  { name: "Google Sheets", value: 128 },
  { name: "Paper only", value: 84 },
  { name: "Custom SMS", value: 22 },
  { name: "Other", value: 18 },
];

const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
};

function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Executive intelligence across your research portfolio."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Analytics" }]}
        actions={
          <>
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filters</Button>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
          </>
        }
      />
      <PageBody className="space-y-4">
        <Card className="shadow-none">
          <CardContent className="flex flex-wrap gap-3 p-4">
            <Select defaultValue="6mo">
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="3mo">Last 3 months</SelectItem>
                <SelectItem value="6mo">Last 6 months</SelectItem>
                <SelectItem value="12mo">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-44"><SelectValue placeholder="Province" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All provinces</SelectItem>
                <SelectItem value="kigali">Kigali</SelectItem>
                <SelectItem value="eastern">Eastern</SelectItem>
                <SelectItem value="western">Western</SelectItem>
                <SelectItem value="southern">Southern</SelectItem>
                <SelectItem value="northern">Northern</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40"><SelectValue placeholder="School type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="faith">Faith-based</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Problems by department</CardTitle>
              <CardDescription>Where operational pain is concentrated</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={problemsByDept} layout="vertical" margin={{ left: 20, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="dept" type="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
                  <Bar dataKey="count" fill="var(--color-chart-1)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Digital maturity index</CardTitle>
              <CardDescription>Average adoption across surveyed schools</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={digitalMaturity}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  <Radar dataKey="A" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.35} />
                  <Tooltip contentStyle={tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-none lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Existing software in use</CardTitle>
              <CardDescription>What schools currently rely on before Inspe SchoolOS</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={software} dataKey="value" nameKey="name" outerRadius={110} label>
                    {software.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
