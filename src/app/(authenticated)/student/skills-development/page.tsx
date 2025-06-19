import { FeaturePage } from "@/components/shared/FeaturePage";
import { Brain, Zap, BookOpen, ExternalLink, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Mock data for skills and resources
const skillsData = [
  { 
    name: "Python Programming", 
    description: "Develop versatile applications, from web development to data science.",
    resources: [
      { name: "Official Python Tutorial", url: "#", type: "Documentation" },
      { name: "Coursera: Python for Everybody", url: "#", type: "Course" },
    ],
    icon: <Zap className="w-6 h-6 text-primary" />,
    image: "https://placehold.co/300x200/9775FA/FFFFFF.png?text=Python",
    aiHint: "coding computer"
  },
  { 
    name: "Data Analysis with Pandas", 
    description: "Learn to manipulate and analyze data effectively using Python's Pandas library.",
    resources: [
      { name: "Pandas Documentation", url: "#", type: "Documentation" },
      { name: "Kaggle Learn: Pandas", url: "#", type: "Interactive Course" },
    ],
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    image: "https://placehold.co/300x200/BEB2FA/333333.png?text=Pandas",
    aiHint: "data chart"
  },
  { 
    name: "Effective Communication", 
    description: "Enhance your ability to convey ideas clearly and persuasively.",
    resources: [
      { name: "Toastmasters International", url: "#", type: "Organization" },
      { name: "Book: Crucial Conversations", url: "#", type: "Book" },
    ],
    icon: <BookOpen className="w-6 h-6 text-primary" />,
    image: "https://placehold.co/300x200/9775FA/FFFFFF.png?text=Talk",
    aiHint: "presentation speaking"
  },
];


export default function SkillsDevelopmentPage() {
  return (
    <FeaturePage
      title="Skills Development Hub"
      icon={Brain}
      description="Explore and develop skills crucial for your career. Personalized learning paths and resources are coming soon!"
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 font-headline">Featured Skills</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsData.map((skill) => (
              <Card key={skill.name} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow rounded-xl">
                <div className="relative h-40 w-full">
                  <Image src={skill.image} alt={skill.name} layout="fill" objectFit="cover" data-ai-hint={skill.aiHint} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-primary-foreground">
                     <h3 className="text-xl font-bold font-headline">{skill.name}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center text-primary mb-2">{skill.icon}</div>
                  <CardDescription className="mb-3 min-h-[40px]">{skill.description}</CardDescription>
                  <h4 className="font-semibold mb-2 text-sm">Recommended Resources:</h4>
                  <ul className="space-y-1 text-sm">
                    {skill.resources.map((res) => (
                      <li key={res.name} className="flex items-center justify-between">
                        <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                          {res.name} <ExternalLink size={12}/>
                        </a>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{res.type}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-4">
                    Start Learning {skill.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline">Personalized Learning Path (Coming Soon!)</CardTitle>
            <CardDescription>
              Our AI will soon curate learning paths tailored to your career goals and existing skills. Input a skill you want to develop, and we'll provide a roadmap.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground p-10">
            <Brain className="h-16 w-16 text-primary mx-auto mb-4 opacity-50" />
            <p className="text-lg">Stay tuned for AI-powered personalized skill development plans!</p>
          </CardContent>
        </Card>
      </div>
    </FeaturePage>
  );
}
