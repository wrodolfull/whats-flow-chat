
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import SetupWizard from '@/components/setup/SetupWizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Phone, Bot, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: "Conversas Ativas",
      value: "12",
      description: "Conversas em andamento",
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      title: "Números WhatsApp",
      value: "3",
      description: "Números configurados",
      icon: Phone,
      color: "text-green-600"
    },
    {
      title: "Chatbots Ativos",
      value: "2",
      description: "Bots respondendo",
      icon: Bot,
      color: "text-purple-600"
    },
    {
      title: "Lojas Shopee",
      value: "1",
      description: "Integração ativa",
      icon: ShoppingBag,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-600">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Setup Wizard */}
        <SetupWizard />
      </div>
    </div>
  );
};

export default Dashboard;
