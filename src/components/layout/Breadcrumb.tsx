
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  
  const pathMap: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/chat': 'Conversas',
    '/admin': 'Administração',
    '/whatsapp-numbers': 'Números WhatsApp',
    '/chatbot-config': 'Configurar IA',
    '/chatbot-management': 'Gerenciar Chatbots',
    '/shopee-integration': 'Integração Shopee'
  };

  const currentPath = location.pathname;
  const currentPageName = pathMap[currentPath] || 'Página';

  if (currentPath === '/dashboard') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link 
        to="/dashboard" 
        className="flex items-center hover:text-green-600 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium text-gray-900">{currentPageName}</span>
    </nav>
  );
};

export default Breadcrumb;
