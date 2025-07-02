
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCurriculum, type CreateCurriculumInput, type CreateCurriculumOutput } from '@/ai/flows/curriculum-creator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { PenTool, BookOpen, Sparkles, Loader2, List, Activity, Download, FileText, FileType } from 'lucide-react';
import { z } from 'zod';
import { GenAiFeaturePage } from '@/components/shared/FeaturePage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Packer, Document, Paragraph, HeadingLevel, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';


const CreateCurriculumInputClientSchema = z.object({
  subject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  learningObjectives: z.string().min(20, { message: "Learning objectives must be at least 20 characters." }),
});

export function CurriculumCreatorClient() {
  const [result, setResult] = useState<CreateCurriculumOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateCurriculumInput>({
    resolver: zodResolver(CreateCurriculumInputClientSchema),
    defaultValues: {
      subject: '',
      learningObjectives: '',
    },
  });

  const onSubmit: SubmitHandler<CreateCurriculumInput> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await createCurriculum(data);
      setResult(response);
    } catch (error) {
      console.error("Curriculum creator error:", error);
      toast({
        title: "Error",
        description: "Failed to create curriculum. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    const doc = new jsPDF();
    const margin = 15;
    let y = 20;
    const pageHeight = doc.internal.pageSize.height;
    
    const addText = (text: string | string[], x: number, yPos: number) => {
        doc.text(text, x, yPos);
        if(Array.isArray(text)) {
            return yPos + text.length * 7;
        }
        return yPos + 7;
    }

    const checkPageBreak = (yPos: number) => {
        if(yPos > pageHeight - margin) {
            doc.addPage();
            return margin;
        }
        return yPos;
    }

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    y = addText(result.title, margin, y);
    y+= 5;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const descriptionLines = doc.splitTextToSize(result.description, doc.internal.pageSize.width - margin * 2);
    y = addText(descriptionLines, margin, y) + 5;
    y = checkPageBreak(y);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    y = addText("Key Learning Objectives", margin, y);
    y = checkPageBreak(y);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    result.learning_objectives.forEach(obj => {
        y = checkPageBreak(y);
        y = addText(`• ${obj}`, margin, y);
    });
    y+=5;
    
    result.modules.forEach(module => {
        y = checkPageBreak(y);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        y = addText(`Module ${module.moduleNumber}: ${module.moduleTitle}`, margin, y);
        
        y = checkPageBreak(y);
        doc.setFontSize(13);
        y = addText("Topics Covered:", margin + 5, y);

        doc.setFontSize(12);
        module.topics.forEach(topic => {
            y = checkPageBreak(y);
            y = addText(`  - ${topic}`, margin + 5, y);
        });

        y = checkPageBreak(y);
        doc.setFontSize(13);
        y = addText("Suggested Activities:", margin + 5, y);

        doc.setFontSize(12);
        module.activities.forEach(activity => {
            y = checkPageBreak(y);
            y = addText(`  - ${activity}`, margin + 5, y);
        });
        y += 10;
    });

    doc.save(`${result.title.replace(/\s/g, '_')}.pdf`);
  };

  const handleDownloadWord = async () => {
    if (!result) return;
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: result.title, heading: HeadingLevel.TITLE }),
          new Paragraph({ text: result.description, spacing: { after: 200 } }),
          new Paragraph({ text: "Key Learning Objectives", heading: HeadingLevel.HEADING_1 }),
          ...result.learning_objectives.map(obj => new Paragraph({ text: obj, bullet: { level: 0 }})),
          new Paragraph(""), // spacing
          ...result.modules.flatMap(module => [
            new Paragraph({ text: `Module ${module.moduleNumber}: ${module.moduleTitle}`, heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
            new Paragraph({ children: [new TextRun({ text: "Topics Covered:", bold: true })]}),
            ...module.topics.map(topic => new Paragraph({ text: topic, bullet: { level: 0 }})),
            new Paragraph(""), // spacing
            new Paragraph({ children: [new TextRun({ text: "Suggested Activities:", bold: true })]}),
            ...module.activities.map(activity => new Paragraph({ text: activity, bullet: { level: 0 }})),
          ])
        ]
      }]
    });
    
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${result.title.replace(/\s/g, '_')}.docx`);
  }

  
  const formComponent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary"/>Subject Matter</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Introduction to Algebra, World War II History" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="learningObjectives"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><PenTool className="w-5 h-5 text-primary"/>Learning Objectives</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List the key learning objectives for this curriculum. e.g., Students will be able to solve linear equations, understand the causes of WWII..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating Curriculum...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Curriculum Outline
            </>
          )}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result && (
    <div className="space-y-6">
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold font-headline">{result.title}</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{result.description}</p>
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Download</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleDownloadPdf}><FileType className="mr-2 h-4 w-4"/>Download as PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadWord}><FileText className="mr-2 h-4 w-4"/>Download as Word</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 font-headline">Key Learning Objectives</h3>
        <div className="flex flex-wrap gap-2">
            {result.learning_objectives.map((obj, i) => (
                <Badge key={i} variant="secondary" className="text-sm">{obj}</Badge>
            ))}
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
        {result.modules.map((module, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-lg font-semibold">
              Module {module.moduleNumber}: {module.moduleTitle}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-md"><List className="w-4 h-4 text-primary"/>Topics Covered</h4>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">
                      {module.topics.map((topic, i) => <li key={i}>{topic}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-md"><Activity className="w-4 h-4 text-primary"/>Suggested Activities</h4>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">
                      {module.activities.map((activity, i) => <li key={i}>{activity}</li>)}
                    </ul>
                  </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );

  return (
    <GenAiFeaturePage
      title="AI Curriculum Creator"
      description="Automate the creation of curriculum outlines based on subject matter and learning objectives."
      icon={PenTool}
      formComponent={formComponent}
      resultComponent={resultComponent}
      isLoading={isLoading}
    />
  );
}
