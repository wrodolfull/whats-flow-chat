
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, User, Phone, MessageSquare, Download } from 'lucide-react';

interface ChatViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chat: any;
}

const ChatViewModal = ({ open, onOpenChange, chat }: ChatViewModalProps) => {
  if (!chat) return null;

  const mockMessages = [
    {
      id: 1,
      type: 'received',
      content: 'Olá, preciso de ajuda com meu pedido',
      timestamp: '10:30',
      status: 'delivered'
    },
    {
      id: 2,
      type: 'sent',
      content: 'Olá! Claro, posso te ajudar. Qual é o número do seu pedido?',
      timestamp: '10:31',
      status: 'read'
    },
    {
      id: 3,
      type: 'received',
      content: 'É o pedido #12345',
      timestamp: '10:32',
      status: 'delivered'
    },
    {
      id: 4,
      type: 'sent',
      content: 'Perfeito! Deixe-me verificar o status do seu pedido...',
      timestamp: '10:33',
      status: 'read'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>{chat.name?.charAt(0) || 'C'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span>{chat.name}</span>
                <Badge variant={chat.status === 'active' ? 'default' : 'secondary'}>
                  {chat.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {chat.phone || '+55 11 99999-9999'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Iniciado em {chat.startedAt || '15/01/2024'}
                </span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[500px]">
          {/* Chat Messages */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="border rounded-lg flex-1 flex flex-col">
              <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">Conversa</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mockMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.type === 'sent'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">{message.timestamp}</span>
                          {message.type === 'sent' && (
                            <div className="text-xs">✓✓</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          {/* Chat Info */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações do Contato
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Nome:</span>
                  <p className="font-medium">{chat.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Telefone:</span>
                  <p className="font-medium">{chat.phone || '+55 11 99999-9999'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Departamento:</span>
                  <p className="font-medium">{chat.department || 'Suporte'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Agente:</span>
                  <p className="font-medium">{chat.agent || 'João Silva'}</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Estatísticas
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mensagens:</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duração:</span>
                  <span className="font-medium">15min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Primeira msg:</span>
                  <span className="font-medium">10:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Última msg:</span>
                  <span className="font-medium">10:45</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Transferir Conversa
              </Button>
              <Button variant="outline" className="w-full">
                Exportar Histórico
              </Button>
              <Button variant="destructive" className="w-full">
                Encerrar Conversa
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatViewModal;
