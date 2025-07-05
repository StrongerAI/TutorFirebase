
// src/app/(authenticated)/teacher/dashboard/page.tsx
"use client";

import { DashboardMetricCard } from "@/components/shared/DashboardMetricCard";
import { FeaturePage } from "@/components/shared/FeaturePage";
import { useUserRole } from "@/hooks/useUserRole";
import { Users, FileCheck, Presentation, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const chartData = [
  { subject: "Math", avgScore: 85, participation: 90 },
  { subject: "Science", avgScore: 78, participation: 82 },
  { subject: "History", avgScore: 92, participation: 95 },
  { subject: "English", avgScore: 88, participation: 80 },
  { subject: "Art", avgScore: 95, participation: 98 },
];

const chartConfig = {
  avgScore: {
    label: "Avg. Score",
    color: "hsl(var(--primary))",
  },
  participation: {
    label: "Participation",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const gradingStatusData = [
    { name: 'Graded', value: 120, fill: 'hsl(var(--primary))' },
    { name: 'Pending', value: 35, fill: 'hsl(var(--accent))' },
    { name: 'Overdue', value: 5, fill: 'hsl(var(--destructive))' },
];

export default function TeacherDashboardPage() {
  const { user } = useUserRole();
  const userName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || "Teacher";

  return (
    <FeaturePage 
      title="Teacher Dashboard" 
      icon={LayoutDashboard} 
      description={`Welcome back, ${userName}! Insights to enhance your teaching effectiveness.`}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardMetricCard
          title="Active Classes"
          value="4"
          description="Total of 120 students"
          icon={Presentation}
        />
        <DashboardMetricCard
          title="Papers to Grade"
          value="12"
          description="3 overdue"
          icon={FileCheck}
        />
        <DashboardMetricCard
          title="Student Engagement"
          value="85%"
          description="Average across all classes"
          icon={Users}
        />
      </div>

      <div className="grid gap-6 mt-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline">Class Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={chartData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="subject"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="avgScore" fill="var(--color-avgScore)" radius={4} />
                  <Bar dataKey="participation" fill="var(--color-participation)" radius={4} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline">Grading Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <PieChart accessibilityLayer>
                    <Pie data={gradingStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                         {gradingStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <Card className="mt-6 shadow-lg rounded-xl">
        <CardHeader>
            <CardTitle className="font-headline">Recent Student Activity</CardTitle>
            <CardDescription>Overview of recent submissions and interactions.</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {[
                    {name: "Alice Smith", activity: "Submitted 'History Essay'", time: "2h ago", avatar: "https://placehold.co/40x40.png?text=AS", hint: "student avatar"},
                    {name: "Bob Johnson", activity: "Asked a question in 'Calculus Q&A'", time: "5h ago", avatar: "https://placehold.co/40x40.png?text=BJ", hint: "student avatar"},
                    {name: "Charlie Brown", activity: "Completed 'Science Quiz 3'", time: "1d ago", avatar: "https://placehold.co/40x40.png?text=CB", hint: "student avatar"},
                ].map(item => (
                    <li key={item.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={item.avatar} alt={item.name} data-ai-hint={item.hint} />
                                <AvatarFallback>{item.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">{item.activity}</p>
                            </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>
    </FeaturePage>
  );
}
