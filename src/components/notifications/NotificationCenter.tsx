
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageCircle, User, AlertCircle, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'new_message' | 'agent_assigned' | 'chat_transferred' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'new_message',
      title: 'Nova mensagem',
      message: 'João Silva enviou uma mensagem',
      timestamp: '2 min atrás',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'chat_transferred',
      title: 'Chat transferido',
      message: 'Conversa com Maria Santos foi transferida para você',
      timestamp: '5 min atrás',
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'agent_assigned',
      title: 'Agente atribuído',
      message: 'Você foi atribuído para atender Pedro Costa',
      timestamp: '10 min atrás',
      read: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'system',
      title: 'Sistema atualizado',
      message: 'Nova versão do sistema foi implantada',
      timestamp: '1 hora atrás',
      read: true,
      priority: 'low'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_message':
        return <MessageCircle className="h-4 w-4" />;
      case 'agent_assigned':
        return <User className="h-4 w-4" />;
      case 'chat_transferred':
        return <MessageCircle className="h-4 w-4" />;
      case 'system':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription>
          Suas notificações mais recentes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-3 rounded-lg border transition-colors",
                notification.read 
                  ? "bg-gray-50 border-gray-200" 
                  : "bg-blue-50 border-blue-200"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex-shrink-0 mt-0.5",
                  getPriorityColor(notification.priority)
                )}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm font-medium",
                        notification.read ? "text-gray-600" : "text-gray-900"
                      )}>
                        {notification.title}
                      </p>
                      <p className={cn(
                        "text-xs mt-1",
                        notification.read ? "text-gray-500" : "text-gray-700"
                      )}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.timestamp}
                      </p>
                    </div>
                    
                    <div className="flex gap-1 ml-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
