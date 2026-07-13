import { createFileRoute } from "@tanstack/react-router";
import { Upload, FileText, Image as ImageIcon, Mic, Video, FileType, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, PageBody } from "@/components/page-header";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence · Inspe Research CRM" },
      { name: "description", content: "Photos, documents, videos, and voice notes collected during school visits." },
    ],
  }),
  component: EvidencePage,
});

const files = [
  { name: "Attendance register — GS Kacyiru II.jpg", type: "photo", size: "2.4 MB", school: "GS Kacyiru II", when: "Today" },
  { name: "Term report sample.pdf", type: "pdf", size: "812 KB", school: "Lycée de Kigali", when: "Today" },
  { name: "ICT room walkthrough.mp4", type: "video", size: "18.2 MB", school: "Riviera High", when: "Yesterday" },
  { name: "Interview — Head Teacher.m4a", type: "audio", size: "3.1 MB", school: "APAPER Nyamirambo", when: "Yesterday" },
  { name: "Fee structure.docx", type: "doc", size: "94 KB", school: "ES Kibogora", when: "2d ago" },
  { name: "Classroom photo 03.jpg", type: "photo", size: "1.8 MB", school: "GS Save", when: "2d ago" },
  { name: "Budget spreadsheet.xlsx", type: "doc", size: "220 KB", school: "GS Nyagatare", when: "3d ago" },
  { name: "Parent meeting audio.m4a", type: "audio", size: "5.6 MB", school: "GS Rwesero", when: "4d ago" },
];

const typeMeta: Record<string, { icon: React.ElementType; bg: string }> = {
  photo: { icon: ImageIcon, bg: "bg-primary/10 text-primary" },
  pdf: { icon: FileText, bg: "bg-destructive/10 text-destructive" },
  doc: { icon: FileType, bg: "bg-success/10 text-success" },
  video: { icon: Video, bg: "bg-accent/20 text-accent-foreground" },
  audio: { icon: Mic, bg: "bg-cream text-cream-foreground" },
};

function EvidencePage() {
  return (
    <>
      <PageHeader
        title="Evidence Library"
        description="1,284 files linked to schools, visits, problems, and questionnaires."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Evidence" }]}
        actions={
          <>
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filter</Button>
            <Button><Upload className="mr-2 h-4 w-4" />Upload</Button>
          </>
        }
      />
      <PageBody>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((f) => {
            const meta = typeMeta[f.type];
            const Icon = meta.icon;
            return (
              <Card key={f.name} className="shadow-none transition hover:border-primary/30">
                <CardContent className="p-4">
                  <div className={`grid h-24 place-items-center rounded-md ${meta.bg}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="mt-3 truncate text-sm font-medium text-foreground" title={f.name}>
                    {f.name}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{f.size}</span>
                    <Badge variant="outline" className="text-[10px]">{f.type.toUpperCase()}</Badge>
                  </div>
                  <div className="mt-2 truncate text-xs text-muted-foreground">
                    {f.school} · {f.when}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}
