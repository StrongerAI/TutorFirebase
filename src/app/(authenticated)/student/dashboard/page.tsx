import { DashboardMetricCard } from "@/components/shared/DashboardMetricCard";
import { FeaturePage } from "@/components/shared/FeaturePage";
import { BarChart, BookOpen, TrendingUp, Activity, LayoutDashboard, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig
} from "@/components/ui/chart";
import { Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Pie, PieChart, Cell } from "recharts";
import Image from "next/image";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Study Hours",
    color: "hsl(var(--primary))",
  },
  mobile: {
    label: "Assignments",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const pieChartData = [
    { name: 'Completed', value: 70, fill: 'hsl(var(--primary))' },
    { name: 'In Progress', value: 20, fill: 'hsl(var(--accent))' },
    { name: 'Pending', value: 10, fill: 'hsl(var(--muted))' },
];


export default function StudentDashboardPage() {
  return (
    <FeaturePage title="Student Dashboard" icon={LayoutDashboard} description="Your personalized learning overview.">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardMetricCard
          title="Active Courses"
          value="5"
          description="+2 from last month"
          icon={BookOpen}
        />
        <DashboardMetricCard
          title="Overall Progress"
          value="75%"
          description="Keep up the great work!"
          icon={TrendingUp}
        />
        <DashboardMetricCard
          title="Assignments Due"
          value="3"
          description="Upcoming this week"
          icon={Activity}
        />
      </div>

      <div className="grid gap-6 mt-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline">Study Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline">Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart accessibilityLayer>
                        <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6 shadow-lg rounded-xl">
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><CheckCircle className="text-green-500"/> Achievements</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex space-x-4 overflow-x-auto pb-4">
                {[
                    { title: "Quick Learner", img: "https://placehold.co/100x100/9775FA/FFFFFF.png?text=QL", hint: "badge award"},
                    { title: "Topic Master: Algebra", img: "https://placehold.co/100x100/BEB2FA/333333.png?text=TM", hint: "badge award"},
                    { title: "Perfect Score", img: "https://placehold.co/100x100/9775FA/FFFFFF.png?text=PS", hint: "badge award"},
                    { title: "Collaborator King", img: "https://placehold.co/100x100/BEB2FA/333333.png?text=CK", hint: "badge award"},
                ].map(ach => (
                    <div key={ach.title} className="text-center shrink-0 w-28">
                        <Image src={ach.img} alt={ach.title} width={80} height={80} className="rounded-full mx-auto mb-2 border-2 border-primary" data-ai-hint={ach.hint} />
                        <p className="text-sm font-medium">{ach.title}</p>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </FeaturePage>
  );
}
