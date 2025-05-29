
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, MessageSquare } from 'lucide-react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Conversas</h2>
            </div>
            {selectedChat && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Conversa Ativa
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <Bell className="h-5 w-5" />
              </Button>
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </Badge>
            </div>
            
            <ThemeToggle />
            
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
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
            <div className="h-full flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">Selecione uma conversa</h3>
                <p className="text-slate-500">Escolha uma conversa na barra lateral para começar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
