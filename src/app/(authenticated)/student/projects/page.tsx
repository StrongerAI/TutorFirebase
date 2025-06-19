import { FeaturePage } from "@/components/shared/FeaturePage";
import { Users, PlusCircle, Filter, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";
import { Input } from "@/components/ui/input";
import Image from "next/image";

// Mock data for projects
const mockProjects: Project[] = [
  { id: '1', title: 'AI Study Buddy App', description: 'Develop an AI-powered application to help students organize their study schedules and resources.', members: ['Alice', 'Bob', 'Charlie'], status: 'Active', lastUpdated: '2 days ago', },
  { id: '2', title: 'History of Ancient Rome Interactive Timeline', description: 'Create an interactive web-based timeline showcasing key events in Ancient Roman history.', members: ['Diana', 'Eve'], status: 'Planning', lastUpdated: '5 days ago', },
  { id: '3', title: 'Sustainable Energy Solutions Research', description: 'Collaborative research paper on innovative sustainable energy solutions for urban environments.', members: ['Frank', 'Grace', 'Henry'], status: 'Completed', lastUpdated: '1 month ago', },
  { id: '4', title: 'Community Coding Workshop', description: 'Organize and run a coding workshop for local high school students.', members: ['Ivy', 'Jack', 'Alice'], status: 'Active', lastUpdated: '1 week ago', }
];

const projectImages = [
    "https://placehold.co/400x200/9775FA/FFFFFF.png?text=Project+Alpha",
    "https://placehold.co/400x200/BEB2FA/333333.png?text=Project+Beta",
    "https://placehold.co/400x200/9775FA/FFFFFF.png?text=Project+Gamma",
    "https://placehold.co/400x200/BEB2FA/333333.png?text=Project+Delta",
];

const projectImageHints = ["teamwork collaboration", "history timeline", "research science", "coding workshop"];


export default function CollaborativeProjectsPage() {
  return (
    <FeaturePage
      title="Collaborative Projects"
      icon={Users}
      description="Join, create, and manage your team projects. Share resources and learn together."
      actionButtons={
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
        </Button>
      }
    >
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-10 text-base" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter Projects
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {mockProjects.map((project, index) => (
          <Card key={project.id} className="shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden flex flex-col">
            <div className="relative w-full h-48">
              <Image src={projectImages[index % projectImages.length]} alt={project.title} layout="fill" objectFit="cover" data-ai-hint={projectImageHints[index % projectImageHints.length]} />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl">{project.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={project.status === 'Active' ? 'default' : project.status === 'Completed' ? 'secondary' : 'outline'}>
                  {project.status}
                </Badge>
                <span className="text-xs text-muted-foreground">Last updated: {project.lastUpdated}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="mb-2 line-clamp-3">{project.description}</CardDescription>
              <div className="text-sm">
                <strong>Members:</strong> {project.members.join(', ')}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="default" className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </FeaturePage>
  );
}
