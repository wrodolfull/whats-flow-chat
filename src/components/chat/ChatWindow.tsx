
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Forward, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'customer';
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'template';
}

interface ChatWindowProps {
  chatId: string;
}

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  // Dados mock das mensagens
  const messages: Message[] = [
    {
      id: '1',
      text: 'Olá! Como posso ajudá-lo hoje?',
      timestamp: '14:20',
      sender: 'user',
      status: 'read'
    },
    {
      id: '2',
      text: 'Oi, gostaria de saber sobre os produtos de vocês',
      timestamp: '14:21',
      sender: 'customer'
    },
    {
      id: '3',
      text: 'Claro! Temos várias opções disponíveis. Que tipo de produto você está procurando?',
      timestamp: '14:22',
      sender: 'user',
      status: 'read'
    },
    {
      id: '4',
      text: 'Estou interessado em produtos para casa',
      timestamp: '14:25',
      sender: 'customer'
    },
    {
      id: '5',
      text: 'Perfeito! Vou enviar nosso catálogo de produtos para casa.',
      timestamp: '14:26',
      sender: 'user',
      status: 'delivered'
    }
  ];

  const templates = [
    'Olá! Como posso ajudá-lo?',
    'Obrigado pelo contato. Em breve retornaremos.',
    'Seu pedido foi confirmado!',
    'Temos uma promoção especial para você!'
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Enviando mensagem:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTemplateSelect = (template: string) => {
    setNewMessage(template);
    setShowTemplates(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
              👨‍💼
            </div>
            <div>
              <h3 className="font-medium text-gray-900">João Silva</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-500">Online</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Forward className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                message.sender === 'user'
                  ? "bg-green-500 text-white"
                  : "bg-white border border-gray-200 text-gray-900"
              )}
            >
              <p className="text-sm">{message.text}</p>
              <div className={cn(
                "flex items-center justify-between mt-1 text-xs",
                message.sender === 'user' ? "text-green-100" : "text-gray-500"
              )}>
                <span>{message.timestamp}</span>
                {message.sender === 'user' && message.status && (
                  <span className={cn(
                    message.status === 'read' ? "text-blue-200" :
                    message.status === 'delivered' ? "text-green-200" : "text-gray-300"
                  )}>
                    {message.status === 'read' ? '✓✓' : 
                     message.status === 'delivered' ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Templates Panel */}
      {showTemplates && (
        <Card className="mx-4 mb-2 p-3">
          <h4 className="text-sm font-medium mb-2">Templates Rápidos</h4>
          <div className="grid grid-cols-1 gap-2">
            {templates.map((template, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start text-left h-auto p-2 whitespace-normal"
                onClick={() => handleTemplateSelect(template)}
              >
                {template}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTemplates(!showTemplates)}
            className={cn(showTemplates && "bg-gray-100")}
          >
            📝
          </Button>
          
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-green-500 hover:bg-green-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
