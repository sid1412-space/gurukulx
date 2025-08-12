
'use client';

import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, X, GripVertical } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  id: number;
  sender: 'You' | 'Tutor';
  text: string;
};

type ChatPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'Tutor', text: "Hello! Welcome to the session. Feel free to ask any questions in the chat." },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now(), sender: 'You', text: newMessage.trim() }]);
      setNewMessage('');
    }
  };

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    if (panelRef.current) {
      panelRef.current.style.cursor = 'grabbing';
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (panelRef.current) {
      panelRef.current.style.cursor = 'default';
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className="absolute z-30"
      style={{
        top: `${position.y}px`,
        right: `${position.x}px`,
        touchAction: 'none',
      }}
    >
      <Card className="w-80 h-[450px] flex flex-col shadow-2xl">
        <CardHeader
          className="flex flex-row items-center justify-between p-3 border-b bg-muted/50"
          onMouseDown={handleMouseDown}
          style={{ cursor: 'grab' }}
        >
          <div className="flex items-center gap-2">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Chat</CardTitle>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col">
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex items-start gap-3", msg.sender === 'You' ? "justify-end" : "")}>
                   {msg.sender === 'Tutor' && (
                     <Avatar className="h-8 w-8">
                       <AvatarImage src="https://placehold.co/100x100.png" alt="Tutor" data-ai-hint="person avatar" />
                       <AvatarFallback>T</AvatarFallback>
                     </Avatar>
                   )}
                  <div className={cn("rounded-lg px-3 py-2 text-sm max-w-[80%]",
                    msg.sender === 'You' ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    {msg.text}
                  </div>
                   {msg.sender === 'You' && (
                     <Avatar className="h-8 w-8">
                       <AvatarImage src="https://placehold.co/100x100.png" alt="You" data-ai-hint="person avatar"/>
                       <AvatarFallback>Y</AvatarFallback>
                     </Avatar>
                   )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-3 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                autoComplete="off"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
