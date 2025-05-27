
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Bell, Settings, User } from 'lucide-react';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  selectedChatId: string | null;
}

const ChatHeader = ({ onToggleSidebar, selectedChatId }: ChatHeaderProps) => {
  return (
    <div className="bg-green-600 text-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="text-white hover:bg-green-700"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">WhatsApp Business</h1>
          <Badge variant="secondary" className="bg-green-700 text-green-100">
            Online
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
            <Bell className="h-5 w-5" />
          </Button>
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </Badge>
        </div>
        
        <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
          <Settings className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2 ml-4">
          <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm">João Atendente</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
