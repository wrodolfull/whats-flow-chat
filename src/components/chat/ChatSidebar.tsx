
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Search, Filter, MessageSquare, Phone, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  platform: 'whatsapp' | 'shopee';
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  phoneNumber?: string;
  shopId?: string;
}

interface ChatSidebarProps {
  collapsed: boolean;
  onChatSelect: (chatId: string) => void;
  selectedChatId: string | null;
}

const ChatSidebar = ({ collapsed, onChatSelect, selectedChatId }: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<'all' | 'whatsapp' | 'shopee'>('all');

  // Mock data com mensagens do WhatsApp e Shopee
  const chats: Chat[] = [
    {
      id: '1',
      name: 'João Silva',
      lastMessage: 'Obrigado pelo atendimento!',
      timestamp: '14:32',
      unreadCount: 0,
      platform: 'whatsapp',
      status: 'online',
      phoneNumber: '+55 11 99999-9999'
    },
    {
      id: '2',
      name: 'Maria Santos',
      lastMessage: 'Quando chegará meu pedido?',
      timestamp: '14:15',
      unreadCount: 2,
      platform: 'shopee',
      status: 'online',
      shopId: 'shop_789012'
    },
    {
      id: '3',
      name: 'Pedro Costa',
      lastMessage: 'Preciso de ajuda com o produto',
      timestamp: '13:45',
      unreadCount: 1,
      platform: 'whatsapp',
      status: 'away',
      phoneNumber: '+55 11 88888-8888'
    },
    {
      id: '4',
      name: 'Ana Comprador',
      lastMessage: 'O produto tem garantia?',
      timestamp: '13:20',
      unreadCount: 3,
      platform: 'shopee',
      status: 'online',
      shopId: 'shop_789012'
    },
    {
      id: '5',
      name: 'Carlos Oliveira',
      lastMessage: 'Gostaria de fazer um pedido',
      timestamp: '12:50',
      unreadCount: 0,
      platform: 'whatsapp',
      status: 'offline',
      phoneNumber: '+55 11 77777-7777'
    }
  ];

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || chat.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const getPlatformIcon = (platform: 'whatsapp' | 'shopee') => {
    if (platform === 'whatsapp') {
      return <Phone className="h-4 w-4 text-green-500" />;
    }
    return <ShoppingBag className="h-4 w-4 text-orange-500" />;
  };

  const getPlatformBadge = (platform: 'whatsapp' | 'shopee') => {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "text-xs",
          platform === 'whatsapp' ? "border-green-200 text-green-700 bg-green-50" : 
          "border-orange-200 text-orange-700 bg-orange-50"
        )}
      >
        {platform === 'whatsapp' ? 'WhatsApp' : 'Shopee'}
      </Badge>
    );
  };

  if (collapsed) {
    return (
      <div className="w-20 bg-white border-r border-gray-200 p-4">
        <div className="space-y-4">
          {filteredChats.slice(0, 5).map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              size="sm"
              className={cn(
                "w-12 h-12 p-0 relative",
                selectedChatId === chat.id && "bg-green-100"
              )}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                {getPlatformIcon(chat.platform)}
              </div>
              {chat.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {chat.unreadCount}
                </div>
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Conversas
        </h2>
        
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filterPlatform === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterPlatform('all')}
              className="flex-1"
            >
              Todas
            </Button>
            <Button
              variant={filterPlatform === 'whatsapp' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterPlatform('whatsapp')}
              className="flex-1"
            >
              <Phone className="h-3 w-3 mr-1" />
              WhatsApp
            </Button>
            <Button
              variant={filterPlatform === 'shopee' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterPlatform('shopee')}
              className="flex-1"
            >
              <ShoppingBag className="h-3 w-3 mr-1" />
              Shopee
            </Button>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <Card
            key={chat.id}
            className={cn(
              "m-2 p-3 cursor-pointer hover:shadow-md transition-all border-l-4",
              selectedChatId === chat.id 
                ? "bg-green-50 border-l-green-500 shadow-md" 
                : "border-l-transparent hover:border-l-gray-300",
              chat.platform === 'shopee' && selectedChatId === chat.id && "bg-orange-50 border-l-orange-500"
            )}
            onClick={() => onChatSelect(chat.id)}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium",
                  chat.platform === 'whatsapp' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                )}>
                  {chat.platform === 'whatsapp' ? '👨‍💼' : '🛍️'}
                </div>
                <div className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                  chat.status === 'online' ? "bg-green-500" :
                  chat.status === 'away' ? "bg-yellow-500" : "bg-gray-400"
                )} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                    {chat.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 truncate mb-2">{chat.lastMessage}</p>
                
                <div className="flex items-center justify-between">
                  {getPlatformBadge(chat.platform)}
                  <div className="text-xs text-gray-400">
                    {chat.platform === 'whatsapp' ? chat.phoneNumber : `Loja: ${chat.shopId}`}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
