
"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send, User, Bot, PanelLeftOpen } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  chatTitle?: string;
  initialMessages?: Message[];
  onSendMessage?: (messageText: string) => Promise<string | null>;
  userAvatarSrc?: string;
  aiAvatarSrc?: string;
  placeholder?: string;
  toggleDesktopSidebar?: () => void; // For desktop sidebar toggle
  isMobile: boolean; // To conditionally show mobile-specific toggle
}

export function ChatInterface({
  chatTitle = "AI Chat",
  initialMessages = [],
  onSendMessage,
  userAvatarSrc,
  aiAvatarSrc,
  placeholder = "Type your message...",
  toggleDesktopSidebar,
  isMobile,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    if (onSendMessage) {
      const aiResponseText = await onSendMessage(userMessage.text);
      if (aiResponseText) {
        const aiMessage: Message = {
          id: Date.now().toString() + '-ai',
          text: aiResponseText,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      }
    } else {
      setTimeout(() => {
        const aiMockMessage: Message = {
          id: Date.now().toString() + '-ai',
          text: `I received your message: "${userMessage.text}". I'm a mock AI.`,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, aiMockMessage]);
        setIsLoading(false);
      }, 1500);
      return; 
    }
    setIsLoading(false);
  };
  
  return (
    <Card className="w-full h-full flex flex-col shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {!isMobile && toggleDesktopSidebar && (
            <Button variant="ghost" size="icon" onClick={toggleDesktopSidebar} aria-label="Toggle chat history">
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
          )}
          <CardTitle className="font-headline text-xl">{chatTitle}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8">
                    {aiAvatarSrc ? <AvatarImage src={aiAvatarSrc} alt="AI Avatar" /> : null}
                    <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18}/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-xl px-4 py-3 shadow-md ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm break-words">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                     {userAvatarSrc ? <AvatarImage src={userAvatarSrc} alt="User Avatar" /> : null}
                    <AvatarFallback className="bg-accent text-accent-foreground"><User size={18} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-3 justify-start">
                 <Avatar className="h-8 w-8">
                    {aiAvatarSrc ? <AvatarImage src={aiAvatarSrc} alt="AI Avatar" /> : null}
                    <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18}/></AvatarFallback>
                  </Avatar>
                <div className="max-w-[70%] rounded-xl px-4 py-3 shadow-md bg-muted text-foreground rounded-bl-none">
                  <div className="flex space-x-1">
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-75"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-200"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-3">
          <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary">
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow text-base"
            disabled={isLoading}
            aria-label="Chat message input"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="bg-primary hover:bg-primary/90">
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
