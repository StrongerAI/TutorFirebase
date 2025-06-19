
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { MessageSquare, PlusCircle, Trash2, Edit3, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import React from "react";

interface ChatThread {
  id: string;
  title: string;
  lastActivity: string;
}

interface ChatHistorySidebarProps {
  threads: ChatThread[];
  selectedThreadId?: string;
  onSelectThread: (threadId: string) => void;
  onNewChat: () => void;
  onDeleteThread?: (threadId: string) => void; // Optional delete functionality
  onRenameThread?: (threadId: string, newTitle: string) => void; // Optional rename
  isDesktopSidebarOpen: boolean;
  toggleDesktopSidebar: () => void;
  isMobile: boolean;
}

export function ChatHistorySidebar({
  threads,
  selectedThreadId,
  onSelectThread,
  onNewChat,
  onDeleteThread,
  onRenameThread,
  isDesktopSidebarOpen,
  toggleDesktopSidebar,
  isMobile,
}: ChatHistorySidebarProps) {
  const content = (
    <div className="flex flex-col h-full bg-card text-card-foreground border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold font-headline">Chat History</h2>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleDesktopSidebar} aria-label="Toggle sidebar">
            {isDesktopSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </Button>
        )}
      </div>
      <div className="p-4">
        <Button onClick={onNewChat} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </div>
      <ScrollArea className="flex-grow">
        <div className="space-y-1 p-4 pt-0">
          {threads.length === 0 && (
            <p className="text-sm text-muted-foreground p-2 text-center">No chat history yet.</p>
          )}
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => onSelectThread(thread.id)}
              className={cn(
                "group flex flex-col p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors",
                selectedThreadId === thread.id && "bg-muted"
              )}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium truncate flex-1 pr-2">{thread.title}</span>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                  {onRenameThread && (
                    <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); /* Implement rename logic */ alert(`Rename ${thread.title}` )}}>
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {onDeleteThread && (
                     <Button variant="ghost" size="icon-sm" className="hover:bg-destructive/10 hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDeleteThread(thread.id); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{thread.lastActivity}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
      {/* Optional Footer can go here */}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-20 left-4 z-40 md:hidden" aria-label="Open chat history">
            <MessageSquare className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px] flex">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out h-full hidden md:flex flex-col",
        isDesktopSidebarOpen ? "w-72" : "w-0 overflow-hidden"
      )}
    >
      {isDesktopSidebarOpen && content}
    </div>
  );
}
