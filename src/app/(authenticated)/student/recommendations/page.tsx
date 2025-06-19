import { FeaturePage } from "@/components/shared/FeaturePage";
import { Lightbulb, BookOpen, Film, Newspaper, ExternalLink, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Mock data for recommendations
const mockRecommendations: Recommendation[] = [
  { id: '1', title: 'Advanced JavaScript Concepts', type: 'Course', source: 'Udemy', url: '#', description: 'Deep dive into closures, prototypes, and async programming in JavaScript.', },
  { id: '2', title: 'Atomic Habits by James Clear', type: 'Book', source: 'Amazon', url: '#', description: 'An easy and proven way to build good habits and break bad ones.', },
  { id: '3', title: 'The AI Revolution: Explained', type: 'Video', source: 'YouTube - Kurzgesagt', url: '#', description: 'A beautifully animated explanation of the current state and future of AI.', },
  { id: '4', title: 'Understanding Machine Learning', type: 'Article', source: 'Towards Data Science', url: '#', description: 'A comprehensive guide to the core concepts of machine learning.'}
];

const recommendationImages = [
    "https://placehold.co/300x150/9775FA/FFFFFF.png?text=JS+Course",
    "https://placehold.co/300x150/BEB2FA/333333.png?text=Atomic+Habits",
    "https://placehold.co/300x150/9775FA/FFFFFF.png?text=AI+Video",
    "https://placehold.co/300x150/BEB2FA/333333.png?text=ML+Article",
];

const recommendationImageHints = ["javascript code", "book habits", "robot ai", "data science"];


const TypeIcon = ({ type }: { type: Recommendation['type'] }) => {
  switch (type) {
    case 'Course': return <BookOpen className="h-5 w-5 text-primary" />;
    case 'Book': return <BookOpen className="h-5 w-5 text-primary" />;
    case 'Video': return <Film className="h-5 w-5 text-primary" />;
    case 'Article': return <Newspaper className="h-5 w-5 text-primary" />;
    default: return <Lightbulb className="h-5 w-5 text-primary" />;
  }
};

export default function PersonalizedRecommendationsPage() {
  return (
    <FeaturePage
      title="Personalized Recommendations"
      icon={Lightbulb}
      description="Discover learning resources, courses, and materials tailored to your interests and learning history."
    >
      <div className="grid md:grid-cols-2 gap-6">
        {mockRecommendations.map((rec, index) => (
          <Card key={rec.id} className="shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden flex flex-col">
            <div className="relative w-full h-40">
                <Image src={recommendationImages[index % recommendationImages.length]} alt={rec.title} layout="fill" objectFit="cover" data-ai-hint={recommendationImageHints[index % recommendationImageHints.length]} />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-xl mb-1">{rec.title}</CardTitle>
                <TypeIcon type={rec.type} />
              </div>
              <Badge variant="outline" className="w-fit">{rec.type} from {rec.source}</Badge>
            </CardHeader>
            <CardContent className="flex-grow">
              {rec.description && <CardDescription className="line-clamp-3">{rec.description}</CardDescription>}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between items-center">
              <Button asChild variant="default">
                <a href={rec.url} target="_blank" rel="noopener noreferrer">
                  View Resource <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <ThumbsUp className="h-5 w-5" />
                <span className="sr-only">Like</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">More recommendations coming soon based on your activity!</p>
      </div>
    </FeaturePage>
  );
}

