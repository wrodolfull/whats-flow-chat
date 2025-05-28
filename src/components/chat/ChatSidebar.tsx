
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Search, Filter, MessageSquare, Phone, ShoppingBag, Plus } from 'lucide-react';
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
      return <Phone className="h-3 w-3 text-green-600 dark:text-green-400" />;
    }
    return <ShoppingBag className="h-3 w-3 text-orange-600 dark:text-orange-400" />;
  };

  if (collapsed) {
    return (
      <div className="w-16 bg-card border-r p-2">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="w-full p-2">
            <Plus className="h-4 w-4" />
          </Button>
          {filteredChats.slice(0, 4).map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full p-2 relative aspect-square",
                selectedChatId === chat.id && "bg-accent"
              )}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                {getPlatformIcon(chat.platform)}
              </div>
              {chat.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
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
    <div className="w-80 bg-card border-r flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversas
          </h2>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-1">
            <Button
              variant={filterPlatform === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterPlatform('all')}
              className="flex-1 text-xs"
            >
              Todas
            </Button>
            <Button
              variant={filterPlatform === 'whatsapp' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterPlatform('whatsapp')}
              className="flex-1 text-xs"
            >
              <Phone className="h-3 w-3 mr-1" />
              WhatsApp
            </Button>
            <Button
              variant={filterPlatform === 'shopee' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterPlatform('shopee')}
              className="flex-1 text-xs"
            >
              <ShoppingBag className="h-3 w-3 mr-1" />
              Shopee
            </Button>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {filteredChats.map((chat) => (
            <Card
              key={chat.id}
              className={cn(
                "p-3 cursor-pointer transition-all border-l-4 hover:shadow-sm",
                selectedChatId === chat.id 
                  ? chat.platform === 'whatsapp'
                    ? "bg-green-50 dark:bg-green-950 border-l-green-500" 
                    : "bg-orange-50 dark:bg-orange-950 border-l-orange-500"
                  : "border-l-transparent hover:border-l-muted-foreground/20 hover:bg-accent/50"
              )}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                    chat.platform === 'whatsapp' 
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" 
                      : "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                  )}>
                    {chat.platform === 'whatsapp' ? '💬' : '🛍️'}
                  </div>
                  <div className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                    chat.status === 'online' ? "bg-green-500" :
                    chat.status === 'away' ? "bg-yellow-500" : "bg-gray-400"
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                      {chat.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground truncate mb-2">{chat.lastMessage}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs px-2 py-0.5",
                        chat.platform === 'whatsapp' 
                          ? "border-green-200 dark:border-green-800 text-green-700 dark:text-green-300" 
                          : "border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300"
                      )}
                    >
                      {getPlatformIcon(chat.platform)}
                      <span className="ml-1">
                        {chat.platform === 'whatsapp' ? 'WhatsApp' : 'Shopee'}
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
