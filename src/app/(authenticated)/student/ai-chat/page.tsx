
"use client";

import { ChatInterface } from '@/components/shared/ChatInterface';
import { ChatHistorySidebar } from '@/components/shared/ChatHistorySidebar';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile'; // Assuming you have a hook like this

// Mock data for chat threads
const mockThreads = [
  { id: '1', title: 'Calculus Problem Help', lastActivity: '2 hours ago' },
  { id: '2', title: 'Essay Brainstorming', lastActivity: 'Yesterday' },
  { id: '3', title: 'Understanding Photosynthesis', lastActivity: '3 days ago' },
];

export default function StudentAiChatPage() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(mockThreads[0]?.id);
  const [threads, setThreads] = useState(mockThreads);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const isMobile = useIsMobile(); // Hook to detect mobile screen size

  const handleStudentMessage = async (messageText: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    // Here you would interact with your actual AI service based on selectedThreadId if needed
    return `Student AI: You asked about "${messageText}" in thread "${selectedThreadId}". How can I help?`;
  };

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    if (isMobile) {
      // Potentially close mobile sheet if open, handled by Sheet component itself
    }
  };

  const handleNewChat = () => {
    const newThreadId = `thread-${Date.now()}`;
    const newThread = { id: newThreadId, title: 'New Chat', lastActivity: 'Just now' };
    setThreads(prev => [newThread, ...prev]);
    setSelectedThreadId(newThreadId);
    // Potentially clear messages in ChatInterface or load new thread messages
  };

  const handleDeleteThread = (threadId: string) => {
    setThreads(prev => prev.filter(t => t.id !== threadId));
    if (selectedThreadId === threadId) {
        setSelectedThreadId(threads.length > 1 ? threads.find(t => t.id !== threadId)?.id : undefined);
    }
  };
  
  const toggleDesktopSidebar = () => {
    if (!isMobile) {
      setIsDesktopSidebarOpen(prev => !prev);
    }
  };

  // Adjust sidebar state on mobile changes
  useEffect(() => {
    if (isMobile) {
      setIsDesktopSidebarOpen(false); // Sidebar should be closed by default on mobile, handled by Sheet
    } else {
      setIsDesktopSidebarOpen(true); // Open by default on desktop
    }
  }, [isMobile]);


  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <ChatHistorySidebar
        threads={threads}
        selectedThreadId={selectedThreadId}
        onSelectThread={handleSelectThread}
        onNewChat={handleNewChat}
        onDeleteThread={handleDeleteThread}
        isDesktopSidebarOpen={isDesktopSidebarOpen}
        toggleDesktopSidebar={toggleDesktopSidebar}
        isMobile={isMobile}
      />
      <main className="flex-1 flex flex-col p-0 overflow-y-auto bg-transparent">
        {/*
          The ChatInterface itself is a Card, so it will have its own background.
          The parent 'main' can be transparent or match page background.
          The p-0 is to ensure ChatInterface Card can span full width/height of this flex item.
        */}
        <ChatInterface 
          onSendMessage={handleStudentMessage} 
          chatTitle="Student AI Learning Assistant"
          placeholder="Ask me anything about your studies..."
          aiAvatarSrc="https://placehold.co/40x40/9775FA/FFFFFF.png?text=AI"
          data-ai-hint="bot avatar"
          toggleDesktopSidebar={!isMobile ? toggleDesktopSidebar : undefined}
          isMobile={isMobile}
        />
      </main>
    </div>
  );
}
