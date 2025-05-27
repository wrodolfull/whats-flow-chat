
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Bot, Mic, Upload, FileText, MessageSquare, Settings, TestTube } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ChatbotConfig = () => {
  const [config, setConfig] = useState({
    openaiApiKey: '',
    model: 'gpt-4o',
    systemPrompt: 'Você é um assistente virtual amigável e prestativo. Responda de forma clara e concisa.',
    voiceEnabled: true,
    voiceModel: 'eleven_multilingual_v2',
    voiceId: '9BWtsMINqrJLrRacOk9x',
    elevenLabsApiKey: '',
    maxTokens: 1000,
    temperature: 0.7,
    autoReply: true,
    workingHours: {
      enabled: true,
      start: '08:00',
      end: '18:00',
      timezone: 'America/Sao_Paulo'
    },
    fileUploadEnabled: true,
    maxFileSize: 10, // MB
    allowedFileTypes: ['image', 'document', 'audio'],
    conversationMemory: true,
    memoryLimit: 10,
    fallbackToHuman: true,
    keywordTriggers: ['ajuda', 'suporte', 'atendimento'],
    responseDelay: 2000 // ms
  });

  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (!config.openaiApiKey) {
      toast({
        title: "Erro",
        description: "API Key da OpenAI é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Configurações salvas!",
      description: "Chatbot configurado com sucesso.",
    });
  };

  const handleTest = async () => {
    setTesting(true);
    
    // Simular teste do chatbot
    setTimeout(() => {
      setTesting(false);
      toast({
        title: "Teste concluído!",
        description: "Chatbot está funcionando corretamente.",
      });
    }, 3000);
  };

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateWorkingHours = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      workingHours: { ...prev.workingHours, [key]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuração do Chatbot IA</h1>
          <p className="text-gray-600">Configure o assistente virtual com inteligência artificial</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="voice">Voz</TabsTrigger>
            <TabsTrigger value="files">Arquivos</TabsTrigger>
            <TabsTrigger value="behavior">Comportamento</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Configurações OpenAI
                  </CardTitle>
                  <CardDescription>Configure a integração com a API da OpenAI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai-key">API Key da OpenAI *</Label>
                    <Input
                      id="openai-key"
                      type="password"
                      value={config.openaiApiKey}
                      onChange={(e) => updateConfig('openaiApiKey', e.target.value)}
                      placeholder="sk-..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Select
                      value={config.model}
                      onValueChange={(value) => updateConfig('model', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-tokens">Max Tokens</Label>
                      <Input
                        id="max-tokens"
                        type="number"
                        value={config.maxTokens}
                        onChange={(e) => updateConfig('maxTokens', parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={config.temperature}
                        onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Prompt do Sistema
                  </CardTitle>
                  <CardDescription>Defina a personalidade e comportamento do chatbot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="system-prompt">Prompt do Sistema</Label>
                    <Textarea
                      id="system-prompt"
                      rows={8}
                      value={config.systemPrompt}
                      onChange={(e) => updateConfig('systemPrompt', e.target.value)}
                      placeholder="Defina como o chatbot deve se comportar..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="voice">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Configurações de Voz
                </CardTitle>
                <CardDescription>Configure síntese e reconhecimento de voz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="voice-enabled">Habilitar Voz</Label>
                    <p className="text-sm text-gray-500">Permite que o chatbot entenda e responda por áudio</p>
                  </div>
                  <Switch
                    id="voice-enabled"
                    checked={config.voiceEnabled}
                    onCheckedChange={(checked) => updateConfig('voiceEnabled', checked)}
                  />
                </div>
                
                {config.voiceEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="elevenlabs-key">API Key ElevenLabs</Label>
                      <Input
                        id="elevenlabs-key"
                        type="password"
                        value={config.elevenLabsApiKey}
                        onChange={(e) => updateConfig('elevenLabsApiKey', e.target.value)}
                        placeholder="sk_..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="voice-model">Modelo de Voz</Label>
                        <Select
                          value={config.voiceModel}
                          onValueChange={(value) => updateConfig('voiceModel', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eleven_multilingual_v2">Multilingual v2</SelectItem>
                            <SelectItem value="eleven_turbo_v2_5">Turbo v2.5</SelectItem>
                            <SelectItem value="eleven_turbo_v2">Turbo v2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="voice-id">Voz</Label>
                        <Select
                          value={config.voiceId}
                          onValueChange={(value) => updateConfig('voiceId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9BWtsMINqrJLrRacOk9x">Aria</SelectItem>
                            <SelectItem value="EXAVITQu4vr4xnSDxMaL">Sarah</SelectItem>
                            <SelectItem value="TX3LPaxmHKxFdv7VOQHJ">Liam</SelectItem>
                            <SelectItem value="XB0fDUnXU5powFXDhCwa">Charlotte</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Configurações de Arquivos
                </CardTitle>
                <CardDescription>Configure o envio e processamento de arquivos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="file-upload">Permitir Upload de Arquivos</Label>
                    <p className="text-sm text-gray-500">Permite que usuários enviem arquivos</p>
                  </div>
                  <Switch
                    id="file-upload"
                    checked={config.fileUploadEnabled}
                    onCheckedChange={(checked) => updateConfig('fileUploadEnabled', checked)}
                  />
                </div>
                
                {config.fileUploadEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="max-file-size">Tamanho Máximo (MB)</Label>
                      <Input
                        id="max-file-size"
                        type="number"
                        value={config.maxFileSize}
                        onChange={(e) => updateConfig('maxFileSize', parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tipos de Arquivo Permitidos</Label>
                      <div className="flex gap-2">
                        {['image', 'document', 'audio', 'video'].map((type) => (
                          <Badge
                            key={type}
                            variant={config.allowedFileTypes.includes(type) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => {
                              const types = config.allowedFileTypes.includes(type)
                                ? config.allowedFileTypes.filter(t => t !== type)
                                : [...config.allowedFileTypes, type];
                              updateConfig('allowedFileTypes', types);
                            }}
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comportamento Geral</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-reply">Resposta Automática</Label>
                      <p className="text-sm text-gray-500">Responde automaticamente às mensagens</p>
                    </div>
                    <Switch
                      id="auto-reply"
                      checked={config.autoReply}
                      onCheckedChange={(checked) => updateConfig('autoReply', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="conversation-memory">Memória de Conversa</Label>
                      <p className="text-sm text-gray-500">Lembra do contexto da conversa</p>
                    </div>
                    <Switch
                      id="conversation-memory"
                      checked={config.conversationMemory}
                      onCheckedChange={(checked) => updateConfig('conversationMemory', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="memory-limit">Limite de Memória (mensagens)</Label>
                    <Input
                      id="memory-limit"
                      type="number"
                      value={config.memoryLimit}
                      onChange={(e) => updateConfig('memoryLimit', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="response-delay">Delay de Resposta (ms)</Label>
                    <Input
                      id="response-delay"
                      type="number"
                      value={config.responseDelay}
                      onChange={(e) => updateConfig('responseDelay', parseInt(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Horário de Funcionamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="working-hours">Horário Limitado</Label>
                      <p className="text-sm text-gray-500">Funciona apenas em horários específicos</p>
                    </div>
                    <Switch
                      id="working-hours"
                      checked={config.workingHours.enabled}
                      onCheckedChange={(checked) => updateWorkingHours('enabled', checked)}
                    />
                  </div>
                  
                  {config.workingHours.enabled && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-time">Início</Label>
                          <Input
                            id="start-time"
                            type="time"
                            value={config.workingHours.start}
                            onChange={(e) => updateWorkingHours('start', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="end-time">Fim</Label>
                          <Input
                            id="end-time"
                            type="time"
                            value={config.workingHours.end}
                            onChange={(e) => updateWorkingHours('end', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Fuso Horário</Label>
                        <Select
                          value={config.workingHours.timezone}
                          onValueChange={(value) => updateWorkingHours('timezone', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                            <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                            <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="fallback-human">Transferir para Humano</Label>
                    <p className="text-sm text-gray-500">Transfere para atendente quando necessário</p>
                  </div>
                  <Switch
                    id="fallback-human"
                    checked={config.fallbackToHuman}
                    onCheckedChange={(checked) => updateConfig('fallbackToHuman', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="keyword-triggers">Palavras-chave para Ativação</Label>
                  <Input
                    id="keyword-triggers"
                    value={config.keywordTriggers.join(', ')}
                    onChange={(e) => updateConfig('keywordTriggers', e.target.value.split(', '))}
                    placeholder="ajuda, suporte, atendimento"
                  />
                  <p className="text-sm text-gray-500">Separar por vírgula</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 mt-8">
          <Button onClick={handleSave} className="flex-1">
            <Settings className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleTest}
            disabled={testing}
            className="px-8"
          >
            {testing ? (
              <>Testando...</>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                Testar Chatbot
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotConfig;
