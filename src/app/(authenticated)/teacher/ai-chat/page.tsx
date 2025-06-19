import { ChatInterface } from '@/components/shared/ChatInterface';
import { MessageCircle } from 'lucide-react'; // Import icon
import { FeaturePage } from '@/components/shared/FeaturePage';

export default function TeacherAiChatPage() {
  // Mock onSendMessage for demonstration
  const handleTeacherMessage = async (messageText: string): Promise<string> => {
    // In a real app, this would call an AI service
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000)); // Simulate API delay
    return `I'm your teacher AI assistant. You mentioned: "${messageText}". How can I support your teaching today?`;
  };

  return (
    <div className="flex-1 flex flex-col">
       <ChatInterface 
        onSendMessage={handleTeacherMessage} 
        chatTitle="Teacher AI Support Chat"
        placeholder="Ask about lesson planning, student engagement, or anything else..."
        aiAvatarSrc="https://placehold.co/40x40/9775FA/FFFFFF.png?text=AI"
        data-ai-hint="bot avatar teacher"
      />
    </div>
  );
}
