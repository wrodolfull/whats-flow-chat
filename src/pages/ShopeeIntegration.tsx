
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Store, Settings, Webhook, TestTube, Plus } from 'lucide-react';
import { ShopeeConfig, ShopeeApiClient, shopeeUtils } from '@/api/shopee';

const ShopeeIntegration = () => {
  const [configs, setConfigs] = useState<ShopeeConfig[]>([
    {
      partnerId: '123456',
      partnerKey: 'your-partner-key',
      shopId: '789012',
      accessToken: 'access-token-here',
      refreshToken: 'refresh-token-here',
      webhookUrl: 'https://api.dohoo.com/webhook/shopee/789012',
      isActive: true
    }
  ]);

  const [newConfig, setNewConfig] = useState<ShopeeConfig>({
    partnerId: '',
    partnerKey: '',
    shopId: '',
    accessToken: '',
    refreshToken: '',
    webhookUrl: '',
    isActive: false
  });

  const [testMessage, setTestMessage] = useState({
    shopId: '',
    fromName: 'Comprador Teste',
    content: 'Olá, tenho uma dúvida sobre meu pedido'
  });

  const { toast } = useToast();

  const handleAddConfig = () => {
    if (!newConfig.partnerId || !newConfig.shopId || !newConfig.accessToken) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const config = {
      ...newConfig,
      webhookUrl: `https://api.dohoo.com/webhook/shopee/${newConfig.shopId}`
    };

    setConfigs(prev => [...prev, config]);
    setNewConfig({
      partnerId: '',
      partnerKey: '',
      shopId: '',
      accessToken: '',
      refreshToken: '',
      webhookUrl: '',
      isActive: false
    });

    toast({
      title: "Configuração adicionada!",
      description: "Loja Shopee configurada com sucesso.",
    });
  };

  const handleToggleConfig = (index: number) => {
    setConfigs(prev => prev.map((config, i) => 
      i === index ? { ...config, isActive: !config.isActive } : config
    ));
  };

  const handleSetupWebhook = async (config: ShopeeConfig) => {
    try {
      const client = new ShopeeApiClient(config);
      const success = await client.setupWebhook();
      
      if (success) {
        toast({
          title: "Webhook configurado!",
          description: "Webhook da Shopee configurado com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Falha ao configurar webhook.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao configurar webhook.",
        variant: "destructive",
      });
    }
  };

  const handleTestWebhook = async () => {
    if (!testMessage.shopId || !testMessage.content) {
      toast({
        title: "Erro",
        description: "Preencha os campos para teste",
        variant: "destructive",
      });
      return;
    }

    try {
      await shopeeUtils.simulateShopeeMessage(
        testMessage.shopId,
        testMessage.fromName,
        testMessage.content
      );

      toast({
        title: "Teste enviado!",
        description: "Mensagem de teste simulada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao simular mensagem.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-orange-500" />
            Integração Shopee
          </h1>
          <p className="text-gray-600">Configure suas lojas Shopee para receber mensagens automaticamente</p>
        </div>

        <Tabs defaultValue="configs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="configs">Configurações</TabsTrigger>
            <TabsTrigger value="add">Adicionar Loja</TabsTrigger>
            <TabsTrigger value="webhook">Webhook</TabsTrigger>
            <TabsTrigger value="test">Testes</TabsTrigger>
          </TabsList>

          <TabsContent value="configs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {configs.map((config, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Store className="h-5 w-5 text-orange-500" />
                        Loja {config.shopId}
                      </CardTitle>
                      <Badge 
                        variant={config.isActive ? 'default' : 'secondary'}
                        className={config.isActive ? 'bg-green-500' : 'bg-gray-500'}
                      >
                        {config.isActive ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                    <CardDescription>
                      Partner ID: {config.partnerId}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Shop ID:</span>
                        <span className="ml-2 font-medium">{config.shopId}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Webhook:</span>
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                          {config.webhookUrl}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={config.isActive}
                          onCheckedChange={() => handleToggleConfig(index)}
                        />
                        <span className="text-sm">Ativa</span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetupWebhook(config)}
                      >
                        <Webhook className="h-4 w-4 mr-2" />
                        Setup
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Adicionar Nova Loja Shopee
                </CardTitle>
                <CardDescription>
                  Configure uma nova loja para recebimento de mensagens
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="partner-id">Partner ID *</Label>
                    <Input
                      id="partner-id"
                      value={newConfig.partnerId}
                      onChange={(e) => setNewConfig(prev => ({ ...prev, partnerId: e.target.value }))}
                      placeholder="123456"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shop-id">Shop ID *</Label>
                    <Input
                      id="shop-id"
                      value={newConfig.shopId}
                      onChange={(e) => setNewConfig(prev => ({ ...prev, shopId: e.target.value }))}
                      placeholder="789012"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="partner-key">Partner Key</Label>
                  <Input
                    id="partner-key"
                    type="password"
                    value={newConfig.partnerKey}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, partnerKey: e.target.value }))}
                    placeholder="sua-partner-key"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="access-token">Access Token *</Label>
                  <Input
                    id="access-token"
                    type="password"
                    value={newConfig.accessToken}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                    placeholder="access-token-da-shopee"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refresh-token">Refresh Token</Label>
                  <Input
                    id="refresh-token"
                    type="password"
                    value={newConfig.refreshToken}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, refreshToken: e.target.value }))}
                    placeholder="refresh-token-da-shopee"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newConfig.isActive}
                      onCheckedChange={(checked) => setNewConfig(prev => ({ ...prev, isActive: checked }))}
                    />
                    <span>Ativar imediatamente</span>
                  </div>
                  
                  <Button onClick={handleAddConfig}>
                    Adicionar Loja
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Configuração de Webhook
                </CardTitle>
                <CardDescription>
                  Configure o webhook para receber mensagens da Shopee
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-800 mb-2">Como configurar:</h4>
                  <ol className="list-decimal list-inside text-sm text-orange-700 space-y-1">
                    <li>Acesse o Shopee Partner Center</li>
                    <li>Vá em "Seller Chat" → "Webhook Settings"</li>
                    <li>Configure a URL do webhook: <code className="bg-orange-100 px-1 rounded">https://api.dohoo.com/webhook/shopee/[SHOP_ID]</code></li>
                    <li>Selecione os eventos: "Message Received" e "Order Update"</li>
                    <li>Clique em "Save" para ativar</li>
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <Label>Eventos suportados:</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">Mensagens recebidas</Badge>
                    <Badge variant="outline">Atualizações de pedido</Badge>
                    <Badge variant="outline">Consultas de produto</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Testar Integração
                </CardTitle>
                <CardDescription>
                  Simule mensagens para testar a integração
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-shop-id">Shop ID</Label>
                    <Input
                      id="test-shop-id"
                      value={testMessage.shopId}
                      onChange={(e) => setTestMessage(prev => ({ ...prev, shopId: e.target.value }))}
                      placeholder="789012"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="test-from-name">Nome do Comprador</Label>
                    <Input
                      id="test-from-name"
                      value={testMessage.fromName}
                      onChange={(e) => setTestMessage(prev => ({ ...prev, fromName: e.target.value }))}
                      placeholder="Comprador Teste"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test-content">Mensagem</Label>
                  <Input
                    id="test-content"
                    value={testMessage.content}
                    onChange={(e) => setTestMessage(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Olá, tenho uma dúvida sobre meu pedido"
                  />
                </div>
                
                <Button onClick={handleTestWebhook} className="w-full">
                  Simular Mensagem
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopeeIntegration;
