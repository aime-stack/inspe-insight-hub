import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, MapPin, MoreHorizontal, Filter, Download, School as SchoolIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, PageBody } from "@/components/page-header";

export const Route = createFileRoute("/schools")({
  head: () => ({
    meta: [
      { title: "Schools · Inspe Research CRM" },
      { name: "description", content: "Directory of researched schools across all provinces and districts." },
    ],
  }),
  component: SchoolsPage,
});

const schools = [
  { name: "GS Kacyiru II", type: "Public", province: "Kigali", district: "Gasabo", students: 1240, status: "Visited", digital: 62 },
  { name: "Lycée de Kigali", type: "Public", province: "Kigali", district: "Nyarugenge", students: 2100, status: "Follow-up", digital: 48 },
  { name: "APAPER Nyamirambo", type: "Private", province: "Kigali", district: "Nyarugenge", students: 640, status: "Planned", digital: 34 },
  { name: "Groupe Scolaire Save", type: "Faith-based", province: "Southern", district: "Gisagara", students: 1580, status: "Visited", digital: 21 },
  { name: "Riviera High School", type: "Private", province: "Kigali", district: "Gasabo", students: 810, status: "Visited", digital: 78 },
  { name: "GS Rwesero", type: "Public", province: "Northern", district: "Rulindo", students: 920, status: "Planned", digital: 18 },
  { name: "ES Kibogora", type: "Faith-based", province: "Western", district: "Nyamasheke", students: 1340, status: "Follow-up", digital: 40 },
  { name: "GS Nyagatare", type: "Public", province: "Eastern", district: "Nyagatare", students: 1810, status: "Contacted", digital: 27 },
];

function statusBadge(s: string) {
  const map: Record<string, string> = {
    Visited: "bg-success/10 text-success border-success/20",
    "Follow-up": "bg-accent/20 text-accent-foreground border-accent/30",
    Planned: "bg-primary/10 text-primary border-primary/20",
    Contacted: "bg-muted text-muted-foreground border-border",
  };
  return map[s] ?? "bg-muted text-muted-foreground";
}

function SchoolsPage() {
  return (
    <>
      <PageHeader
        title="Schools"
        description="325 schools across 5 provinces · 187 visited · 138 pending"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Schools" }]}
        actions={
          <>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add school
            </Button>
          </>
        }
      />
      <PageBody className="space-y-4">
        <Card className="shadow-none">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by name, district, contact…" className="pl-8" />
              </div>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="visited">Visited</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="followup">Follow-up</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead>Digital readiness</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.map((s) => (
                <TableRow key={s.name} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                        <SchoolIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <Link to="/schools" className="truncate font-medium text-foreground hover:underline">
                          {s.name}
                        </Link>
                        <div className="text-xs text-muted-foreground">RW-EDU-{Math.floor(Math.random() * 90000) + 10000}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{s.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <MapPin className="mr-1 inline h-3 w-3" />
                    {s.district}, {s.province}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{s.students.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-success" style={{ width: `${s.digital}%` }} />
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground">{s.digital}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusBadge(s.status) + " border font-medium"} variant="outline">
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Schedule visit</DropdownMenuItem>
                        <DropdownMenuItem>Add contact</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </PageBody>
    </>
  );
}
