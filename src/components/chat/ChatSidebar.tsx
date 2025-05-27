import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Star, MessageCircle, Settings, LogOut, Users, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'active' | 'finished' | 'waiting';
  isStarred: boolean;
  avatar: string;
}

interface ChatSidebarProps {
  collapsed: boolean;
  onChatSelect: (chatId: string) => void;
  selectedChatId: string | null;
}

const ChatSidebar = ({ collapsed, onChatSelect, selectedChatId }: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const chats: Chat[] = [
    {
      id: '1',
      name: 'João Silva',
      lastMessage: 'Oi, gostaria de saber sobre os produtos',
      time: '14:30',
      unread: 2,
      status: 'active',
      isStarred: true,
      avatar: '👨‍💼'
    },
    {
      id: '2', 
      name: 'Maria Santos',
      lastMessage: 'Obrigada pelo atendimento!',
      time: '13:45',
      unread: 0,
      status: 'finished',
      isStarred: false,
      avatar: '👩‍💼'
    },
    {
      id: '3',
      name: 'Pedro Costa',
      lastMessage: 'Quando vocês abrem?',
      time: '12:20',
      unread: 1,
      status: 'waiting',
      isStarred: false,
      avatar: '👨'
    },
    {
      id: '4',
      name: 'Ana Oliveira',
      lastMessage: 'Preciso de ajuda com meu pedido',
      time: 'Ontem',
      unread: 3,
      status: 'active',
      isStarred: true,
      avatar: '👩'
    }
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const starredChats = filteredChats.filter(chat => chat.isStarred);
  const otherChats = filteredChats.filter(chat => !chat.isStarred);

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-80"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        {!collapsed && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Conversas</h2>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar conversas..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </>
        )}
        
        {collapsed && (
          <Button variant="ghost" size="sm" className="w-full">
            <MessageCircle className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {!collapsed && (
          <>
            {/* Starred Chats */}
            {starredChats.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-700">Favoritos</span>
                </div>
                
                <div className="space-y-1">
                  {starredChats.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isSelected={selectedChatId === chat.id}
                      onClick={() => onChatSelect(chat.id)}
                    />
                  ))}
                </div>
                
                <Separator className="mt-4" />
              </div>
            )}

            {/* Other Chats */}
            <div className="p-4">
              <div className="space-y-1">
                {otherChats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isSelected={selectedChatId === chat.id}
                    onClick={() => onChatSelect(chat.id)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
        
        {collapsed && (
          <div className="p-2 space-y-2">
            {chats.slice(0, 4).map((chat) => (
              <Button
                key={chat.id}
                variant={selectedChatId === chat.id ? "default" : "ghost"}
                size="sm"
                className="w-full justify-center relative"
                onClick={() => onChatSelect(chat.id)}
              >
                <span className="text-lg">{chat.avatar}</span>
                {chat.unread > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs rounded-full p-0 flex items-center justify-center">
                    {chat.unread}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed ? (
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Encaminhar
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-full text-red-600">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

const ChatItem = ({ chat, isSelected, onClick }: ChatItemProps) => {
  return (
    <div
      className={cn(
        "p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50",
        isSelected && "bg-green-50 border border-green-200",
        chat.status === 'finished' && "opacity-60"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
            {chat.avatar}
          </div>
          
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
            chat.status === 'active' ? "bg-green-500" :
            chat.status === 'waiting' ? "bg-yellow-500" : "bg-gray-400"
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
              {chat.isStarred && (
                <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
              )}
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">{chat.time}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            {chat.unread > 0 && (
              <Badge className="bg-green-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center">
                {chat.unread}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
