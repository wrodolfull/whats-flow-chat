
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Trash2, Bot, MessageSquare, Users, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreateChatbotModal from '@/components/modals/CreateChatbotModal';

interface Chatbot {
  id: string;
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  status: 'active' | 'inactive' | 'training';
  assignedNumbers: string[];
  totalConversations: number;
  avgResponseTime: string;
  voiceEnabled: boolean;
  fileHandling: boolean;
  createdAt: string;
}

const ChatbotManagement = () => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([
    {
      id: '1',
      name: 'Suporte Geral',
      description: 'Chatbot para atendimento geral e suporte técnico',
      model: 'gpt-4o',
      systemPrompt: 'Você é um assistente de suporte técnico amigável e prestativo.',
      status: 'active',
      assignedNumbers: ['+55 11 99999-9999', '+55 11 88888-8888'],
      totalConversations: 1247,
      avgResponseTime: '1.2s',
      voiceEnabled: true,
      fileHandling: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Vendas',
      description: 'Bot especializado em vendas e conversão de leads',
      model: 'gpt-4o-mini',
      systemPrompt: 'Você é um consultor de vendas experiente focado em conversão.',
      status: 'active',
      assignedNumbers: ['+55 11 77777-7777'],
      totalConversations: 856,
      avgResponseTime: '0.8s',
      voiceEnabled: false,
      fileHandling: true,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'Atendimento Técnico',
      description: 'Especialista em problemas técnicos complexos',
      model: 'gpt-4o',
      systemPrompt: 'Você é um especialista técnico que resolve problemas complexos.',
      status: 'training',
      assignedNumbers: [],
      totalConversations: 0,
      avgResponseTime: '-',
      voiceEnabled: true,
      fileHandling: true,
      createdAt: '2024-01-20'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBot, setEditingBot] = useState<Chatbot | null>(null);
  const { toast } = useToast();

  const handleCreateBot = (botData: Omit<Chatbot, 'id' | 'assignedNumbers' | 'totalConversations' | 'avgResponseTime' | 'createdAt'>) => {
    const newBot: Chatbot = {
      ...botData,
      id: Date.now().toString(),
      assignedNumbers: [],
      totalConversations: 0,
      avgResponseTime: '-',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setChatbots(prev => [...prev, newBot]);
    setShowCreateModal(false);
    toast({
      title: "Chatbot criado!",
      description: "Novo chatbot criado com sucesso.",
    });
  };

  const handleEditBot = (botData: Omit<Chatbot, 'id' | 'assignedNumbers' | 'totalConversations' | 'avgResponseTime' | 'createdAt'>) => {
    if (editingBot) {
      setChatbots(prev => prev.map(bot => 
        bot.id === editingBot.id 
          ? { ...bot, ...botData }
          : bot
      ));
      setEditingBot(null);
      setShowCreateModal(false);
      toast({
        title: "Chatbot atualizado!",
        description: "Configurações do chatbot atualizadas com sucesso.",
      });
    }
  };

  const handleDeleteBot = (id: string) => {
    setChatbots(prev => prev.filter(bot => bot.id !== id));
    toast({
      title: "Chatbot removido!",
      description: "Chatbot removido com sucesso.",
    });
  };

  const openEditModal = (bot: Chatbot) => {
    setEditingBot(bot);
    setShowCreateModal(true);
  };

  const openCreateModal = () => {
    setEditingBot(null);
    setShowCreateModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'training': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'training': return 'Treinando';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Chatbots</h1>
          <p className="text-gray-600">Crie e configure chatbots com inteligência artificial</p>
        </div>

        <div className="mb-6">
          <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Criar Novo Chatbot
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((bot) => (
            <Card key={bot.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    {bot.name}
                  </CardTitle>
                  <Badge 
                    variant="secondary"
                    className={getStatusColor(bot.status)}
                  >
                    {getStatusText(bot.status)}
                  </Badge>
                </div>
                <CardDescription>{bot.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Modelo:</span>
                    <span className="font-medium">{bot.model}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Números:</span>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span className="font-medium">{bot.assignedNumbers.length}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Conversas:</span>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span className="font-medium">{bot.totalConversations}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tempo Resposta:</span>
                    <span className="font-medium">{bot.avgResponseTime}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {bot.voiceEnabled && (
                    <Badge variant="outline" className="text-xs">
                      🎤 Voz
                    </Badge>
                  )}
                  {bot.fileHandling && (
                    <Badge variant="outline" className="text-xs">
                      📎 Arquivos
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(bot)}
                    className="flex-1"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteBot(bot.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <CreateChatbotModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onBotCreated={handleCreateBot}
          onBotUpdated={handleEditBot}
          editingBot={editingBot}
        />
      </div>
    </div>
  );
};

export default ChatbotManagement;
