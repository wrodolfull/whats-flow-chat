
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  Star,
  Archive,
  Flag,
  Users,
  Bot,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import QuickActions from './QuickActions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'customer' | 'bot';
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'template';
}

interface ChatWindowProps {
  chatId: string;
}

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const messages: Message[] = [
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual. Como posso ajudá-lo hoje?',
      timestamp: '14:20',
      sender: 'bot',
      status: 'read'
    },
    {
      id: '2',
      text: 'Gostaria de saber sobre meu pedido #12345',
      timestamp: '14:21',
      sender: 'customer'
    },
    {
      id: '3',
      text: 'Claro! Vou verificar o status do seu pedido. Um momento...',
      timestamp: '14:22',
      sender: 'user',
      status: 'read'
    },
    {
      id: '4',
      text: 'Seu pedido #12345 está em processo de separação e será enviado em breve.',
      timestamp: '14:25',
      sender: 'user',
      status: 'delivered'
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Enviando mensagem:', newMessage);
      setNewMessage('');
      setShowQuickActions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMessages: { [key: string]: string } = {
      'order-status': 'Vou verificar o status do seu pedido. Pode me informar o número?',
      'payment-help': 'Posso ajudar com questões de pagamento. Qual é sua dúvida?',
      'delivery-info': 'Para informações de entrega, preciso do número do pedido.',
      'business-hours': 'Nosso atendimento funciona de segunda a sexta, das 8h às 18h.',
      'urgent-support': 'Entendi que é urgente. Vou transferir para um especialista.',
      'problem-solved': 'Fico feliz que conseguimos resolver! Há mais alguma coisa?'
    };
    
    setNewMessage(actionMessages[action] || '');
    setShowQuickActions(false);
  };

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'bot':
        return <Bot className="h-3 w-3" />;
      case 'user':
        return <UserIcon className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getSenderLabel = (sender: string) => {
    switch (sender) {
      case 'bot':
        return 'Assistente IA';
      case 'user':
        return 'Atendente';
      case 'customer':
        return 'Cliente';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="bg-card border-b px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
              JS
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">João Silva</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-500">Online agora</span>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              WhatsApp
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <Star className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border shadow-md">
                <DropdownMenuItem className="cursor-pointer">
                  <Users className="mr-2 h-4 w-4" />
                  Transferir conversa
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Flag className="mr-2 h-4 w-4" />
                  Marcar como importante
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive">
                  <Archive className="mr-2 h-4 w-4" />
                  Arquivar conversa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === 'user' || message.sender === 'bot' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-xs lg:max-w-md rounded-lg shadow-sm border",
                message.sender === 'user'
                  ? "bg-blue-600 text-white px-4 py-3 border-blue-600"
                  : message.sender === 'bot'
                  ? "bg-slate-100 text-slate-800 px-4 py-3 border-slate-200"
                  : "bg-white border-slate-200 px-4 py-3"
              )}
            >
              {(message.sender === 'bot' || message.sender === 'user') && (
                <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
                  {getSenderIcon(message.sender)}
                  <span>{getSenderLabel(message.sender)}</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.text}</p>
              <div className={cn(
                "flex items-center justify-between mt-2 text-xs",
                message.sender === 'customer' ? "text-slate-500" : "opacity-70"
              )}>
                <span>{message.timestamp}</span>
                {message.sender === 'user' && message.status && (
                  <span className="text-xs">
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

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="px-6">
          <QuickActions onActionSelect={handleQuickAction} />
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowQuickActions(!showQuickActions)}
            className={cn(
              "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
              showQuickActions && "bg-slate-100 text-slate-900"
            )}
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", showQuickActions && "rotate-180")} />
            Ações Rápidas
          </Button>
          
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
