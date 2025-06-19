
"use client";

import { ChatInterface } from '@/components/shared/ChatInterface';
import { ChatHistorySidebar } from '@/components/shared/ChatHistorySidebar';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile'; // Assuming you have a hook like this

// Mock data for chat threads
const mockThreads = [
  { id: '1', title: 'Lesson Plan Ideas: Grade 5 Math', lastActivity: '1 hour ago' },
  { id: '2', title: 'Student Engagement Strategies', lastActivity: 'Yesterday' },
  { id: '3', title: 'Using AI in Classroom', lastActivity: '4 days ago' },
];

export default function TeacherAiChatPage() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(mockThreads[0]?.id);
  const [threads, setThreads] = useState(mockThreads);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  const handleTeacherMessage = async (messageText: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    return `Teacher AI: You mentioned "${messageText}" for thread "${selectedThreadId}". How can I support your teaching?`;
  };

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
  };

  const handleNewChat = () => {
    const newThreadId = `thread-${Date.now()}`;
    const newThread = { id: newThreadId, title: 'New Teaching Query', lastActivity: 'Just now' };
    setThreads(prev => [newThread, ...prev]);
    setSelectedThreadId(newThreadId);
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
  
  useEffect(() => {
    if (isMobile) {
      setIsDesktopSidebarOpen(false);
    } else {
      setIsDesktopSidebarOpen(true);
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
        <ChatInterface 
          onSendMessage={handleTeacherMessage} 
          chatTitle="Teacher AI Support Chat"
          placeholder="Ask about lesson planning, student engagement..."
          aiAvatarSrc="https://placehold.co/40x40/9775FA/FFFFFF.png?text=AI"
          data-ai-hint="bot avatar teacher"
          toggleDesktopSidebar={!isMobile ? toggleDesktopSidebar : undefined}
          isMobile={isMobile}
        />
      </main>
    </div>
  );
}
