"use client";

import { ChatInterface } from '@/components/shared/ChatInterface';
import { MessageCircle } from 'lucide-react'; // Import icon
import { FeaturePage } from '@/components/shared/FeaturePage';

export default function StudentAiChatPage() {
  // Mock onSendMessage for demonstration
  const handleStudentMessage = async (messageText: string): Promise<string> => {
    // In a real app, this would call an AI service
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000)); // Simulate API delay
    return `I'm your student AI assistant. You said: "${messageText}". How can I help you learn today?`;
  };

  return (
    // Wrap ChatInterface with FeaturePage or use specific title within ChatInterface if it supports it
    // For now, let's assume ChatInterface is the full page content styled appropriately
    // Or, if FeaturePage is desired for title consistency:
    // <FeaturePage title="AI Chat" icon={MessageCircle} description="Chat with your AI learning assistant.">
    //   <ChatInterface onSendMessage={handleStudentMessage} chatTitle="Student AI Tutor" />
    // </FeaturePage>
    // Simplified for now, ChatInterface will be full height.
    <div className="flex-1 flex flex-col">
       <ChatInterface 
        onSendMessage={handleStudentMessage} 
        chatTitle="Student AI Learning Assistant"
        placeholder="Ask me anything about your studies..."
        aiAvatarSrc="https://placehold.co/40x40/9775FA/FFFFFF.png?text=AI"
        data-ai-hint="bot avatar"
      />
    </div>
  );
}
