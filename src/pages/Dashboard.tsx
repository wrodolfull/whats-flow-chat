
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import SetupWizard from '@/components/setup/SetupWizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Phone, Bot, ShoppingBag, TrendingUp } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Visão geral do sistema</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
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
