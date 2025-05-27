
import React, { useState } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import ChatHeader from '@/components/chat/ChatHeader';
import Navbar from '@/components/layout/Navbar';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar />
      
      <div className="flex-1 flex">
        <ChatSidebar 
          collapsed={sidebarCollapsed}
          onChatSelect={setSelectedChat}
          selectedChatId={selectedChat}
        />
        
        <div className="flex-1 flex flex-col">
          <ChatHeader 
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            selectedChatId={selectedChat}
          />
          
          <div className="flex-1 overflow-hidden">
            {selectedChat ? (
              <ChatWindow chatId={selectedChat} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-medium mb-2">Selecione uma conversa</h3>
                  <p>Escolha uma conversa na barra lateral para começar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
