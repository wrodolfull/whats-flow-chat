
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Home, 
  Phone, 
  Bot, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut,
  Zap,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  permission?: string;
  badge?: string;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export function AppSidebar() {
  const location = useLocation();
  const { user, hasPermission, logout } = useAuth();

  const menuGroups: MenuGroup[] = [
    {
      label: 'Principal',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: Home,
          permission: 'dashboard.view'
        },
        {
          title: 'Conversas',
          url: '/chat',
          icon: MessageSquare,
          permission: 'chat.view',
          badge: '12'
        }
      ]
    },
    {
      label: 'Integrações',
      items: [
        {
          title: 'WhatsApp',
          url: '/whatsapp-numbers',
          icon: Phone,
          permission: 'whatsapp.view'
        },
        {
          title: 'Shopee',
          url: '/shopee-integration',
          icon: ShoppingBag,
          permission: 'shopee.view'
        }
      ]
    },
    {
      label: 'Automação',
      items: [
        {
          title: 'Chatbots',
          url: '/chatbot-management',
          icon: Bot,
          permission: 'chatbot.view'
        },
        {
          title: 'Configurar IA',
          url: '/chatbot-config',
          icon: Settings,
          permission: 'chatbot.manage'
        }
      ]
    },
    {
      label: 'Administração',
      items: [
        {
          title: 'Usuários',
          url: '/admin',
          icon: Users,
          permission: 'admin.view'
        }
      ]
    }
  ];

  const filteredGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => !item.permission || hasPermission(item.permission))
  })).filter(group => group.items.length > 0);

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Dohoo XT</h1>
            <Badge variant="secondary" className="text-xs">Pro</Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {filteredGroups.map((group, index) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2 py-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.url;
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                          <Icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {index < filteredGroups.length - 1 && <SidebarSeparator />}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role === 'admin' ? 'Administrador' : 
                 user?.role === 'manager' ? 'Gerente' : 'Atendente'}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
