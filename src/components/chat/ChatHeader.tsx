
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Bell, Settings, User, MessageSquare } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  selectedChatId: string | null;
}

const ChatHeader = ({ onToggleSidebar, selectedChatId }: ChatHeaderProps) => {
  return (
    <div className="bg-card border-b p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Dohoo XT</h1>
            <Badge variant="secondary">
              Pro
            </Badge>
          </div>
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
          
          <div className="flex items-center gap-2 ml-4 px-2 py-1 rounded-md bg-muted">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">João Atendente</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
