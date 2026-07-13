import { createFileRoute } from "@tanstack/react-router";
import { Plus, Mail, Phone, MessageCircle, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader, PageBody } from "@/components/page-header";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts · Inspe Research CRM" },
      { name: "description", content: "Manage school contacts across all roles: head teachers, deputies, accountants, ICT officers." },
    ],
  }),
  component: ContactsPage,
});

const contacts = [
  { name: "Emmanuel Bizimana", role: "Head Teacher", school: "GS Kacyiru II", email: "e.bizimana@edu.rw", phone: "+250 788 123 456", pref: "WhatsApp" },
  { name: "Claudine Uwase", role: "Director of Studies", school: "Lycée de Kigali", email: "c.uwase@lyk.rw", phone: "+250 788 555 011", pref: "Email" },
  { name: "Patrick Nkurunziza", role: "Accountant", school: "APAPER Nyamirambo", email: "patrick@apaper.rw", phone: "+250 722 890 100", pref: "Phone" },
  { name: "Marie-Claire Ingabire", role: "ICT Officer", school: "Riviera High School", email: "mc@riviera.edu", phone: "+250 788 991 234", pref: "WhatsApp" },
  { name: "Jean Baptiste K.", role: "Proprietor", school: "APAPER Nyamirambo", email: "jb@apaper.rw", phone: "+250 788 700 200", pref: "Phone" },
  { name: "Sarah Mukamana", role: "Deputy Head", school: "ES Kibogora", email: "s.mukamana@kibogora.rw", phone: "+250 788 402 012", pref: "Email" },
];

function ContactsPage() {
  return (
    <>
      <PageHeader
        title="Contacts"
        description="People we've engaged across schools — headteachers, deputies, accountants, ICT staff."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Contacts" }]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add contact
          </Button>
        }
      />
      <PageBody className="space-y-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search contacts…" className="pl-8" />
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {contacts.map((c) => (
            <Card key={c.email} className="shadow-none transition hover:border-primary/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {c.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-foreground">{c.name}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {c.role} · {c.school}
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0 bg-cream/60 border-cream text-cream-foreground">
                        {c.pref}
                      </Badge>
                    </div>
                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{c.email}</div>
                      <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{c.phone}</div>
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      <Button size="sm" variant="outline" className="h-7 text-xs"><Mail className="mr-1 h-3 w-3" />Email</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs"><Phone className="mr-1 h-3 w-3" />Call</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs"><MessageCircle className="mr-1 h-3 w-3" />Chat</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageBody>
    </>
  );
}
