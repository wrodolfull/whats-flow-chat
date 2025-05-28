
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Trash2, Play, Pause, Copy, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { flowsAPI, Flow } from '@/api/flows';

const Flows = () => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    try {
      const data = await flowsAPI.getFlows();
      setFlows(data);
    } catch (error) {
      console.error('Error loading flows:', error);
      toast({
        title: "Erro ao carregar",
        description: "Erro ao carregar os fluxos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFlow = async (id: string) => {
    try {
      await flowsAPI.deleteFlow(id);
      setFlows(prev => prev.filter(flow => flow.id !== id));
      toast({
        title: "Fluxo removido!",
        description: "Fluxo removido com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting flow:', error);
      toast({
        title: "Erro ao remover",
        description: "Erro ao remover o fluxo.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await flowsAPI.updateFlow(id, { status: newStatus });
      setFlows(prev => prev.map(flow => 
        flow.id === id ? { ...flow, status: newStatus } : flow
      ));
      toast({
        title: "Status atualizado!",
        description: `Fluxo ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating flow status:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Erro ao atualizar o status do fluxo.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'draft': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'draft': return 'Rascunho';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fluxos de Atendimento</h1>
          <p className="text-gray-600">Gerencie todos os fluxos de atendimento automatizado</p>
        </div>

        <div className="mb-6 flex gap-4">
          <Button onClick={() => window.location.href = '/flow-builder'} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Criar Novo Fluxo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flows.map((flow) => (
            <Card key={flow.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{flow.name}</CardTitle>
                  <Badge 
                    variant="secondary"
                    className={getStatusColor(flow.status)}
                  >
                    {getStatusText(flow.status)}
                  </Badge>
                </div>
                <CardDescription>{flow.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Criado em:</span>
                    <span className="font-medium">
                      {new Date(flow.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Atualizado em:</span>
                    <span className="font-medium">
                      {new Date(flow.updated_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `/flow-builder?id=${flow.id}`}
                    className="flex-1"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(flow.id, flow.status)}
                  >
                    {flow.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteFlow(flow.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {flows.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Play className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum fluxo criado</h3>
            <p className="text-gray-500 mb-6">Comece criando seu primeiro fluxo de atendimento</p>
            <Button onClick={() => window.location.href = '/flow-builder'}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Fluxo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flows;
