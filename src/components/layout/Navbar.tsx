
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MessageSquare, 
  Settings, 
  Phone, 
  Bot, 
  Users,
  LogOut,
  ShoppingBag,
  ChevronDown,
  Home,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();

  const primaryNavItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: Home
    },
    {
      path: '/chat',
      label: 'Conversas',
      icon: MessageSquare
    }
  ];

  const configurationItems = [
    {
      path: '/whatsapp-numbers',
      label: 'Números WhatsApp',
      icon: Phone
    },
    {
      path: '/chatbot-management',
      label: 'Gerenciar Chatbots',
      icon: Bot
    },
    {
      path: '/shopee-integration',
      label: 'Integração Shopee',
      icon: ShoppingBag
    },
    {
      path: '/admin',
      label: 'Administração',
      icon: Users
    }
  ];

  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Dohoo XT</h1>
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}

              {/* Configuration Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Configurações do Sistema</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {configurationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link 
                          to={item.path}
                          className="flex items-center cursor-pointer"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/chatbot-config"
                      className="flex items-center cursor-pointer"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      Configurar IA
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Sistema Multi-Plataforma
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
