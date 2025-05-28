
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Phone, Bot, ShoppingBag, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  completed?: boolean;
}

const SetupWizard = () => {
  const navigate = useNavigate();
  
  const [steps] = useState<SetupStep[]>([
    {
      id: 'whatsapp',
      title: 'Configurar Números WhatsApp',
      description: 'Configure seus números do WhatsApp Business API',
      icon: Phone,
      route: '/whatsapp-numbers',
      completed: false
    },
    {
      id: 'chatbot',
      title: 'Criar Chatbots',
      description: 'Configure chatbots com IA para automatizar atendimentos',
      icon: Bot,
      route: '/chatbot-management',
      completed: false
    },
    {
      id: 'shopee',
      title: 'Integração Shopee',
      description: 'Conecte suas lojas da Shopee para centralizar mensagens',
      icon: ShoppingBag,
      route: '/shopee-integration',
      completed: false
    },
    {
      id: 'admin',
      title: 'Configurações Avançadas',
      description: 'Configure departamentos, agentes e permissões',
      icon: Settings,
      route: '/admin',
      completed: false
    }
  ]);

  const handleStepClick = (route: string) => {
    navigate(route);
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo ao Dohoo XT
        </h1>
        <p className="text-gray-600 mb-4">
          Configure sua central de atendimento multi-plataforma em poucos passos
        </p>
        
        <div className="bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          {completedSteps} de {steps.length} etapas concluídas
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          
          return (
            <Card 
              key={step.id}
              className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-green-500"
              onClick={() => handleStepClick(step.route)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        Etapa {index + 1}
                      </Badge>
                    </div>
                  </div>
                  {step.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-300" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {step.description}
                </CardDescription>
                <Button 
                  className="w-full mt-4" 
                  variant={step.completed ? "outline" : "default"}
                >
                  {step.completed ? "Revisar Configuração" : "Configurar Agora"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          🚀 Dica para começar
        </h3>
        <p className="text-blue-800 text-sm">
          Recomendamos começar configurando pelo menos um número do WhatsApp e um chatbot. 
          Isso permitirá que você teste o sistema e comece a receber mensagens imediatamente.
        </p>
      </div>
    </div>
  );
};

export default SetupWizard;
