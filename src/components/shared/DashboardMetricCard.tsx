import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardMetricCardProps {
  title: string;
  value?: string;
  description?: string;
  icon?: React.ElementType;
  isLoading?: boolean;
  children?: React.ReactNode; // For charts or more complex content
  className?: string;
}

export function DashboardMetricCard({
  title,
  value,
  description,
  icon: Icon,
  isLoading = false,
  children,
  className
}: DashboardMetricCardProps) {
  return (
    <Card className={`shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </>
        ) : (
          <>
            {value && <div className="text-3xl font-bold font-headline text-primary">{value}</div>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </>
        )}
        {children && <div className="mt-4">{children}</div>}
      </CardContent>
    </Card>
  );
}
