import { createFileRoute } from "@tanstack/react-router";
import { User, Shield, Bell, Users, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageHeader, PageBody } from "@/components/page-header";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Settings · Inspe Research CRM" }],
  }),
  component: SettingsPage,
});

const team = [
  { name: "Jean Mukiza", email: "jean@spellabs.rw", role: "Research Manager" },
  { name: "Aline Uwimana", email: "aline@spellabs.rw", role: "Research Officer" },
  { name: "Patrick Munyaneza", email: "patrick@spellabs.rw", role: "Research Officer" },
  { name: "Diane Keza", email: "diane@spellabs.rw", role: "Sales Representative" },
  { name: "Grace Iradukunda", email: "grace@spellabs.rw", role: "Analyst" },
];

function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your profile, team, roles, and workspace preferences."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Settings" }]}
      />
      <PageBody className="mx-auto max-w-4xl space-y-6">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Profile</CardTitle>
            </div>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input defaultValue="Jean Mukiza" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input defaultValue="jean@spellabs.rw" />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input defaultValue="Research Manager" disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input defaultValue="+250 788 000 000" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button>Save changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Team</CardTitle>
            </div>
            <CardDescription>5 members · Role-based access control</CardDescription>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {team.map((m) => (
              <div key={m.email} className="flex items-center gap-3 p-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {m.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{m.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{m.email}</div>
                </div>
                <Badge variant="outline">{m.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["New visit assigned", true],
              ["Problem flagged as Critical", true],
              ["Weekly research digest", false],
              ["Follow-up reminders", true],
            ].map(([label, on], i) => (
              <div key={i}>
                <div className="flex items-center justify-between">
                  <div className="text-sm">{label as string}</div>
                  <Switch defaultChecked={on as boolean} />
                </div>
                {i < 3 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline"><Key className="mr-2 h-4 w-4" />Change password</Button>
            <div className="text-xs text-muted-foreground">
              Two-factor authentication and audit logs available once Lovable Cloud is enabled.
            </div>
          </CardContent>
        </Card>
      </PageBody>
    </>
  );
}
