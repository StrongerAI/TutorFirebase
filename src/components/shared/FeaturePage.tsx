
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface FeaturePageProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  actionButtons?: React.ReactNode;
}

export function FeaturePage({ title, description, icon: Icon, children, className, actionButtons }: FeaturePageProps) {
  return (
    <div className={`h-full overflow-y-auto p-6 space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-8 w-8 text-primary" />}
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        </div>
        {actionButtons && <div className="flex gap-2">{actionButtons}</div>}
      </div>
      
      <Card className="shadow-lg rounded-xl">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

interface GenAiFeaturePageProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  formComponent: React.ReactNode;
  resultComponent?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function GenAiFeaturePage({ title, description, icon: Icon, formComponent, resultComponent, isLoading, className }: GenAiFeaturePageProps) {
  return (
    <div className={`h-full overflow-y-auto p-6 space-y-6 ${className}`}>
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-muted/30 border-b p-6">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-7 w-7 text-primary" />}
            <div>
              <CardTitle className="text-2xl font-headline">{title}</CardTitle>
              <CardDescription className="text-md">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-8"> {/* Changed from grid to flex-col */}
            <div>
              {formComponent}
            </div>
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-md z-10">
                  <div className="flex flex-col items-center gap-2 text-primary">
                    <Sparkles className="h-8 w-8 animate-pulse" />
                    <p className="text-lg font-semibold">Generating... Please wait.</p>
                  </div>
                </div>
              )}
              {resultComponent ? (
                <Card className="bg-muted/30 min-h-[200px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">AI Output</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     {resultComponent}
                  </CardContent>
                </Card>
              ) : (
                 <Card className="bg-muted/30 min-h-[200px] flex items-center justify-center">
                    <CardContent className="text-center text-muted-foreground">
                        <Sparkles className="h-10 w-10 mx-auto mb-2" />
                        <p>AI output will appear here.</p>
                    </CardContent>
                 </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
