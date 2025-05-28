
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings } from 'lucide-react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Conversas</h2>
            {selectedChat && (
              <Badge variant="outline">
                Conversa Ativa
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </Badge>
            </div>
            
            <ThemeToggle />
            
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Chat Content */}
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar 
          collapsed={sidebarCollapsed}
          onChatSelect={setSelectedChat}
          selectedChatId={selectedChat}
        />
        
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <ChatWindow chatId={selectedChat} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold mb-2">Selecione uma conversa</h3>
                <p className="text-muted-foreground">Escolha uma conversa na barra lateral para começar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
