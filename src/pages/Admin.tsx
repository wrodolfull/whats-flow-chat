
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Settings, BarChart3, MessageSquare, Building, UserPlus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Admin = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Vendas', strategy: 'round_robin', agents: ['João Silva', 'Maria Santos'] },
    { id: 2, name: 'Suporte', strategy: 'load_balance', agents: ['Pedro Costa', 'Ana Oliveira'] }
  ]);

  const [agents, setAgents] = useState([
    { id: 1, name: 'João Silva', email: 'joao@empresa.com', department: 'Vendas', status: 'online' },
    { id: 2, name: 'Maria Santos', email: 'maria@empresa.com', department: 'Vendas', status: 'offline' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@empresa.com', department: 'Suporte', status: 'online' },
    { id: 4, name: 'Ana Oliveira', email: 'ana@empresa.com', department: 'Suporte', status: 'busy' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie departamentos, agentes e configurações do sistema</p>
        </div>

        <Tabs defaultValue="departments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Departamentos
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Agentes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="departments">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Criar Departamento</CardTitle>
                  <CardDescription>Configure um novo departamento com estratégia de distribuição</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dept-name">Nome do Departamento</Label>
                    <Input id="dept-name" placeholder="Ex: Vendas, Suporte, Financeiro" />
                  </div>
                  
                  <div>
                    <Label htmlFor="strategy">Estratégia de Distribuição</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a estratégia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="round_robin">Round Robin</SelectItem>
                        <SelectItem value="load_balance">Balanceamento de Carga</SelectItem>
                        <SelectItem value="random">Aleatório</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full">Criar Departamento</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Departamentos Ativos</CardTitle>
                  <CardDescription>Lista de departamentos configurados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{dept.name}</h3>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{dept.strategy}</Badge>
                            <span className="text-sm text-gray-500">{dept.agents.length} agentes</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Agentes: {dept.agents.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Lista de Agentes</CardTitle>
                  <CardDescription>Gerencie todos os agentes do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agents.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            agent.status === 'online' ? 'bg-green-500' :
                            agent.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`} />
                          <div>
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-sm text-gray-500">{agent.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{agent.department}</Badge>
                          <Badge variant={agent.status === 'online' ? 'default' : 'secondary'}>
                            {agent.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Agente</CardTitle>
                  <CardDescription>Convide um novo agente para o sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="agent-name">Nome</Label>
                    <Input id="agent-name" placeholder="Nome do agente" />
                  </div>
                  
                  <div>
                    <Label htmlFor="agent-email">Email</Label>
                    <Input id="agent-email" type="email" placeholder="email@empresa.com" />
                  </div>
                  
                  <div>
                    <Label htmlFor="agent-dept">Departamento</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vendas">Vendas</SelectItem>
                        <SelectItem value="suporte">Suporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Convidar Agente
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Conversas</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+20.1% desde o mês passado</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agentes Online</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">de 16 agentes totais</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4min</div>
                  <p className="text-xs text-muted-foreground">-5% desde a semana passada</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.5%</div>
                  <p className="text-xs text-muted-foreground">+2% desde o mês passado</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Análise de Conversas com IA</CardTitle>
                <CardDescription>Relatório automático gerado por IA sobre o histórico de conversas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">Insights da Semana</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 78% das conversas foram resolvidas no primeiro contato</li>
                    <li>• Principais temas: dúvidas sobre produtos (45%), suporte técnico (30%)</li>
                    <li>• Horário de pico: 14h às 16h</li>
                    <li>• Satisfação média do cliente: 4.2/5</li>
                  </ul>
                </div>
                
                <Button>Gerar Novo Relatório</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do WhatsApp</CardTitle>
                  <CardDescription>Configure a integração com a API do WhatsApp</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="phone-id">Phone Number ID</Label>
                    <Input id="phone-id" placeholder="Digite o Phone Number ID" />
                  </div>
                  
                  <div>
                    <Label htmlFor="access-token">Access Token</Label>
                    <Input id="access-token" type="password" placeholder="Digite o Access Token" />
                  </div>
                  
                  <div>
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input id="webhook-url" placeholder="https://seu-dominio.com/webhook" />
                  </div>
                  
                  <Button>Salvar Configurações</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Templates de Mensagem</CardTitle>
                  <CardDescription>Gerencie templates pré-aprovados pelo WhatsApp</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Templates Disponíveis</Label>
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Boas-vindas</span>
                        <Badge>Aprovado</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Olá {{1}}, bem-vindo à nossa empresa!</p>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Confirmação de Pedido</span>
                        <Badge>Aprovado</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Seu pedido #{{1}} foi confirmado e será entregue em {{2}}.</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">Gerenciar Templates</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
